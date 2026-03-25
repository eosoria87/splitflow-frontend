import groupService from './groupService';
import type { GroupMember, RawExpense } from './groupService';
import type { TransactionGroup, TransactionCategory } from '../types/Transaction';
import type { DebtSettlement } from '../types/Debt';

export interface GroupCache {
  groupName: string;
  category: string;
  description: string;
  userRole: string;
  createdAt: string;
  membersCount: number;
  memberNames: string[];
  balance: number;
  transactionGroups: TransactionGroup[];
  settlements: DebtSettlement[];
}

const VALID_CATEGORIES: TransactionCategory[] = [
  'food', 'transport', 'accommodation', 'shopping', 'entertainment', 'utilities', 'other',
];

const mapCategory = (cat: string | null): TransactionCategory =>
  VALID_CATEGORIES.includes(cat as TransactionCategory) ? (cat as TransactionCategory) : 'other';

const formatDateLabel = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
};

/** Computes net balance per member and optimized settlements from local data — no extra API calls. */
const computeBalancesAndSettlements = (
  expenses: RawExpense[],
  members: GroupMember[],
  currentUserId: string,
): { userBalance: number; settlements: DebtSettlement[] } => {
  // Build name lookup from members
  const nameOf: Record<string, string> = {};
  members.forEach(m => { nameOf[m.user_id] = m.name; });

  // Calculate net balance per user (paid - owed)
  const net: Record<string, number> = {};
  members.forEach(m => { net[m.user_id] = 0; });

  expenses.forEach(exp => {
    net[exp.paid_by] = (net[exp.paid_by] ?? 0) + exp.amount;
    exp.participants.forEach(p => {
      net[p.user_id] = (net[p.user_id] ?? 0) - p.share;
    });
  });

  // Round to avoid floating-point drift
  Object.keys(net).forEach(id => {
    net[id] = parseFloat(net[id].toFixed(2));
  });

  const userBalance = net[currentUserId] ?? 0;

  // Greedy settlement optimization (same algorithm as backend)
  const creditors = Object.entries(net)
    .filter(([, v]) => v > 0.01)
    .map(([id, v]) => ({ id, name: nameOf[id] ?? 'Unknown', remaining: v }))
    .sort((a, b) => b.remaining - a.remaining);

  const debtors = Object.entries(net)
    .filter(([, v]) => v < -0.01)
    .map(([id, v]) => ({ id, name: nameOf[id] ?? 'Unknown', remaining: Math.abs(v) }))
    .sort((a, b) => b.remaining - a.remaining);

  const settlements: DebtSettlement[] = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const amount = parseFloat(Math.min(debtors[i].remaining, creditors[j].remaining).toFixed(2));

    if (amount > 0.01 && (debtors[i].id === currentUserId || creditors[j].id === currentUserId)) {
      settlements.push({
        id: `${i}-${j}`,
        debtorName: debtors[i].name,
        creditorName: creditors[j].name,
        amount,
        type: debtors[i].id === currentUserId ? 'you-owe' : 'owes-you',
      });
    }

    debtors[i].remaining -= amount;
    creditors[j].remaining -= amount;
    if (debtors[i].remaining < 0.01) i++;
    if (creditors[j].remaining < 0.01) j++;
  }

  return { userBalance, settlements };
};

export const loadGroupCache = (groupId: string): GroupCache | null => {
  try {
    const stored = sessionStorage.getItem(`sf_group_${groupId}`);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
};

export const saveGroupCache = (groupId: string, data: GroupCache) => {
  try { sessionStorage.setItem(`sf_group_${groupId}`, JSON.stringify(data)); }
  catch { /* storage quota */ }
};

export const buildGroupCache = async (
  groupId: string,
  currentUserId: string,
  prefetchedExpenses?: RawExpense[],
): Promise<GroupCache> => {
  // 1–2 requests: detail always needed for member names; expenses reused if already fetched
  const [groupRes, expensesRes] = await Promise.allSettled([
    groupService.getGroupById(groupId),
    prefetchedExpenses ? Promise.resolve(prefetchedExpenses) : groupService.getGroupExpenses(groupId),
  ]);

  const cache: GroupCache = {
    groupName: '',
    category: 'other',
    description: '',
    userRole: '',
    createdAt: '',
    membersCount: 0,
    memberNames: [],
    balance: 0,
    transactionGroups: [],
    settlements: [],
  };

  const members: GroupMember[] = groupRes.status === 'fulfilled' ? groupRes.value.members : [];
  const expenses: RawExpense[] = expensesRes.status === 'fulfilled' ? expensesRes.value : [];

  if (groupRes.status === 'fulfilled') {
    const g = groupRes.value;
    cache.groupName = g.name;
    cache.category = g.category || 'other';
    cache.description = g.description || '';
    cache.userRole = g.userRole || '';
    cache.createdAt = g.created_at;
    cache.membersCount = g.members.length;
    cache.memberNames = g.members.map(m => m.name);
  }

  if (expensesRes.status === 'fulfilled') {
    const byDate: Record<string, typeof expenses> = {};
    expenses.forEach(exp => {
      if (!byDate[exp.date]) byDate[exp.date] = [];
      byDate[exp.date].push(exp);
    });

    cache.transactionGroups = Object.entries(byDate)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, exps]) => ({
        dateLabel: formatDateLabel(date),
        dailyTotal: exps.reduce((sum, e) => sum + e.amount, 0),
        transactions: exps.map(exp => {
          const participant = exp.participants.find(p => p.user_id === currentUserId);
          const isPayer = exp.paid_by === currentUserId;
          let userNetChange = 0;
          let userStatus: 'you owe' | 'you lent' | 'not involved' = 'not involved';

          if (participant) {
            if (isPayer) {
              userNetChange = exp.amount - participant.share;
              userStatus = 'you lent';
            } else {
              userNetChange = -participant.share;
              userStatus = 'you owe';
            }
          }

          return {
            id: exp.id,
            title: exp.description,
            category: mapCategory(exp.category),
            paidBy: exp.payer_name,
            paidById: exp.paid_by,
            date: exp.date,
            totalAmount: exp.amount,
            splitDetails: `Split ${exp.participants_count} ways`,
            userNetChange,
            userStatus,
          };
        }),
      }));
  }

  // Compute balance and settlements from already-fetched data
  const { userBalance, settlements } = computeBalancesAndSettlements(expenses, members, currentUserId);
  cache.balance = userBalance;
  cache.settlements = settlements;

  return cache;
};

export const prefetchGroup = (groupId: string, currentUserId: string, expenses?: RawExpense[]): void => {
  if (loadGroupCache(groupId)) return; // already warm
  buildGroupCache(groupId, currentUserId, expenses)
    .then(cache => saveGroupCache(groupId, cache))
    .catch(() => {});
};

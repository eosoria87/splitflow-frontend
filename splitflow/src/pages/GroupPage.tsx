import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import GroupBalanceCard from "../components/group/GroupBalanceCard";
import TransactionFeed from "../components/group/TransactionFeed";
import GroupDetailsBar from "../components/group/GroupDetailsBar";
import OptimizationEngineCard from "../components/group/OptimizationEngineCard";
import Header from "../components/navigation/Header";
import Sidebar from "../components/navigation/Sidebar";
import MainContainer from "../components/ui/MainContainer";
import groupService from '../services/groupService';
import type { TransactionGroup, TransactionCategory } from '../types/Transaction';
import type { DebtSettlement } from '../types/Debt';

const VALID_CATEGORIES: TransactionCategory[] = ['food', 'transport', 'accommodation', 'shopping', 'entertainment', 'utilities', 'other'];

const mapCategory = (cat: string | null): TransactionCategory =>
  VALID_CATEGORIES.includes(cat as TransactionCategory) ? (cat as TransactionCategory) : 'other';

const formatDateLabel = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
};

const getCurrentUserId = (): string => {
  try { return JSON.parse(localStorage.getItem('sf_user') || '{}').id ?? ''; }
  catch { return ''; }
};

const GroupPage = () => {
  const { id: groupId } = useParams<{ id: string }>();
  const [groupName, setGroupName] = useState('');
  const [category, setCategory] = useState('other');
  const [membersCount, setMembersCount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [transactionGroups, setTransactionGroups] = useState<TransactionGroup[]>([]);
  const [settlements, setSettlements] = useState<DebtSettlement[]>([]);

  useEffect(() => {
    if (!groupId) return;
    const currentUserId = getCurrentUserId();

    const fetchAll = async () => {
      const [groupRes, expensesRes, balancesRes, settlementsRes] = await Promise.allSettled([
        groupService.getGroupById(groupId),
        groupService.getGroupExpenses(groupId),
        groupService.getGroupBalances(groupId),
        groupService.getSettlementSuggestions(groupId),
      ]);

      if (groupRes.status === 'fulfilled') {
        const g = groupRes.value;
        setGroupName(g.name);
        setCategory(g.category || 'other');
        setMembersCount(g.members.length);
      }

      if (expensesRes.status === 'fulfilled') {
        const expenses = expensesRes.value;
        const byDate: Record<string, typeof expenses> = {};
        expenses.forEach(exp => {
          if (!byDate[exp.date]) byDate[exp.date] = [];
          byDate[exp.date].push(exp);
        });

        const groups: TransactionGroup[] = Object.entries(byDate)
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
                totalAmount: exp.amount,
                splitDetails: `Split ${exp.participants_count} ways`,
                userNetChange,
                userStatus,
              };
            }),
          }));

        setTransactionGroups(groups);
      }

      if (balancesRes.status === 'fulfilled') {
        const userBalance = balancesRes.value.find(b => b.userId === currentUserId);
        setBalance(userBalance?.netBalance ?? 0);
      }

      if (settlementsRes.status === 'fulfilled') {
        const mapped: DebtSettlement[] = settlementsRes.value
          .filter(s => s.from === currentUserId || s.to === currentUserId)
          .map((s, idx) => ({
            id: String(idx),
            debtorName: s.from_name,
            creditorName: s.to_name,
            amount: s.amount,
            type: s.from === currentUserId ? 'you-owe' : 'owes-you',
          }));
        setSettlements(mapped);
      }
    };

    fetchAll();
  }, [groupId]);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <Header
          title={groupName || 'Loading...'}
          icon={<PaperAirplaneIcon />}
        />
        <GroupDetailsBar
          category={category}
          membersCount={membersCount}
          memberAvatars={[]}
        />
        <MainContainer columnsNum={3}>
          <div className="xl:col-span-2 flex flex-col gap-4">
            <TransactionFeed groups={transactionGroups} />
          </div>
          <div className="xl:col-span-1 space-y-6 lg:sticky lg:top-8">
            <GroupBalanceCard balance={balance} />
            <OptimizationEngineCard settlements={settlements} />
          </div>
        </MainContainer>
      </main>
    </div>
  );
};

export default GroupPage;

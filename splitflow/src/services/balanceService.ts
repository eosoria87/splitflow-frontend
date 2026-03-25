import { apiClient } from "../utils/apiClient";
import type { RawExpense, BalanceEntry } from "./groupService";

export const BALANCE_CACHE_KEY = 'sf_balance';

// ── Types ────────────────────────────────────────────────────────────────────

interface RawGroup {
	id: string;
	name: string;
	category: string;
}

interface RawSettlement {
	from_user: string;
	to_user: string;
	amount: number;
}

export interface GroupBalanceData {
	id: string;
	name: string;
	category: string;
	amount: number;
	type: 'owed-to-me' | 'i-owe';
}

export interface PersonBalanceData {
	id: string;
	name: string;
	amount: number;
	type: 'owed-to-me' | 'i-owe';
}

export interface FlowInsights {
	monthlySpend: number;
	spendChange: number | null;
	topDebtGroupName: string;
	settledPercentage: number;
	recoveredPercentage: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Replicates the backend's greedy settlement optimization so we can compute
// the "By Person" view from already-fetched balance data without an extra API call.
function optimizeSettlements(balances: BalanceEntry[]) {
	const creditors = balances
		.filter(b => b.netBalance > 0.01)
		.map(b => ({ ...b, remaining: b.netBalance }))
		.sort((a, b) => b.remaining - a.remaining);

	const debtors = balances
		.filter(b => b.netBalance < -0.01)
		.map(b => ({ ...b, remaining: Math.abs(b.netBalance) }))
		.sort((a, b) => b.remaining - a.remaining);

	const settlements: { from: string; fromName: string; to: string; toName: string; amount: number }[] = [];
	let i = 0, j = 0;

	while (i < debtors.length && j < creditors.length) {
		const amount = Math.min(debtors[i].remaining, creditors[j].remaining);
		if (amount > 0.01) {
			settlements.push({
				from: debtors[i].userId, fromName: debtors[i].name,
				to: creditors[j].userId, toName: creditors[j].name,
				amount: parseFloat(amount.toFixed(2)),
			});
		}
		debtors[i].remaining -= amount;
		creditors[j].remaining -= amount;
		if (debtors[i].remaining < 0.01) i++;
		if (creditors[j].remaining < 0.01) j++;
	}

	return settlements;
}

// ── Service ───────────────────────────────────────────────────────────────────

export const balanceService = {

	// Fetch the list of groups the user belongs to
	getGroups: async (): Promise<RawGroup[]> => {
		try {
			const res = await apiClient.get('/groups');
			return res.data.groups ?? [];
		} catch {
			return [];
		}
	},

	// Fetch balances for all groups in a single parallel batch
	getGroupBalancesMap: async (groups: RawGroup[]): Promise<Record<string, BalanceEntry[]>> => {
		if (!groups.length) return {};
		const results = await Promise.allSettled(
			groups.map(g => apiClient.get(`/groups/${g.id}/balances`))
		);
		const map: Record<string, BalanceEntry[]> = {};
		results.forEach((res, idx) => {
			map[groups[idx].id] = res.status === 'fulfilled' ? (res.value.data.balances ?? []) : [];
		});
		return map;
	},

	// Fetch expenses for all groups in a single parallel batch
	getGroupExpensesMap: async (groups: RawGroup[]): Promise<Record<string, RawExpense[]>> => {
		if (!groups.length) return {};
		const results = await Promise.allSettled(
			groups.map(g => apiClient.get(`/groups/${g.id}/expenses`))
		);
		const map: Record<string, RawExpense[]> = {};
		results.forEach((res, idx) => {
			map[groups[idx].id] = res.status === 'fulfilled' ? (res.value.data.expenses ?? []) : [];
		});
		return map;
	},

	// Fetch settlement history for all groups in a single parallel batch
	getGroupSettlementsMap: async (groups: RawGroup[]): Promise<Record<string, RawSettlement[]>> => {
		if (!groups.length) return {};
		const results = await Promise.allSettled(
			groups.map(g => apiClient.get(`/groups/${g.id}/settlements`))
		);
		const map: Record<string, RawSettlement[]> = {};
		results.forEach((res, idx) => {
			map[groups[idx].id] = res.status === 'fulfilled' ? (res.value.data.settlements ?? []) : [];
		});
		return map;
	},

	// Pure compute — group view (owed to me / I owe, grouped by group)
	computeGroupView: (
		userId: string,
		groups: RawGroup[],
		balancesMap: Record<string, BalanceEntry[]>,
	): { owedToMe: GroupBalanceData[]; iOwe: GroupBalanceData[] } => {
		const owedToMe: GroupBalanceData[] = [];
		const iOwe: GroupBalanceData[] = [];

		groups.forEach(group => {
			const myBalance = (balancesMap[group.id] ?? []).find(b => b.userId === userId);
			if (!myBalance) return;
			const net = myBalance.netBalance;
			if (net > 0.01) {
				owedToMe.push({ id: group.id, name: group.name, category: group.category || 'other', amount: net, type: 'owed-to-me' });
			} else if (net < -0.01) {
				iOwe.push({ id: group.id, name: group.name, category: group.category || 'other', amount: Math.abs(net), type: 'i-owe' });
			}
		});

		return { owedToMe, iOwe };
	},

	// Pure compute — person view (net amounts aggregated across all groups, per person)
	// Derives settlement suggestions from already-fetched balances — no extra API call.
	computePersonView: (
		userId: string,
		balancesMap: Record<string, BalanceEntry[]>,
	): { owedToMe: PersonBalanceData[]; iOwe: PersonBalanceData[] } => {
		const ledger: Record<string, { name: string; netAmount: number }> = {};

		Object.values(balancesMap).forEach(balances => {
			optimizeSettlements(balances).forEach(s => {
				if (s.to === userId) {
					if (!ledger[s.from]) ledger[s.from] = { name: s.fromName, netAmount: 0 };
					ledger[s.from].netAmount += s.amount;
				}
				if (s.from === userId) {
					if (!ledger[s.to]) ledger[s.to] = { name: s.toName, netAmount: 0 };
					ledger[s.to].netAmount -= s.amount;
				}
			});
		});

		const owedToMe: PersonBalanceData[] = [];
		const iOwe: PersonBalanceData[] = [];

		Object.entries(ledger).forEach(([pid, data]) => {
			if (data.netAmount > 0.01) {
				owedToMe.push({ id: pid, name: data.name, amount: data.netAmount, type: 'owed-to-me' });
			} else if (data.netAmount < -0.01) {
				iOwe.push({ id: pid, name: data.name, amount: Math.abs(data.netAmount), type: 'i-owe' });
			}
		});

		return { owedToMe, iOwe };
	},

	// Pure compute — flow insights from already-fetched maps, no API calls
	computeInsights: (
		userId: string,
		groups: RawGroup[],
		balancesMap: Record<string, BalanceEntry[]>,
		expensesMap: Record<string, RawExpense[]>,
		settlementsMap: Record<string, RawSettlement[]>,
	): FlowInsights => {
		const now = new Date();
		const curMonth = now.getMonth(), curYear = now.getFullYear();
		const lastMonthDate = new Date(curYear, curMonth - 1, 1);
		const lastMonth = lastMonthDate.getMonth(), lastMonthYear = lastMonthDate.getFullYear();

		let currentMonthSpend = 0, lastMonthSpend = 0;
		let totalCurrentlyOwedToMe = 0, totalCurrentlyIOwe = 0;
		let highestDebt = 0, topDebtGroupName = 'None';
		let totalSettlementsReceived = 0, totalSettlementsSent = 0;

		groups.forEach(group => {
			const myBalance = (balancesMap[group.id] ?? []).find(b => b.userId === userId);
			if (myBalance) {
				const net = myBalance.netBalance;
				if (net > 0) {
					totalCurrentlyOwedToMe += net;
				} else if (net < 0) {
					const abs = Math.abs(net);
					totalCurrentlyIOwe += abs;
					if (abs > highestDebt) { highestDebt = abs; topDebtGroupName = group.name; }
				}
			}

			(expensesMap[group.id] ?? []).forEach(expense => {
				const rawDate = (expense.date || expense.created_at).substring(0, 10);
				const [expYear, expMonth] = rawDate.split('-').map(Number);
				const myPart = expense.participants.find(p => p.user_id === userId);
				const myShare = myPart ? myPart.share : 0;
				if (expMonth - 1 === curMonth && expYear === curYear) currentMonthSpend += myShare;
				if (expMonth - 1 === lastMonth && expYear === lastMonthYear) lastMonthSpend += myShare;
			});

			(settlementsMap[group.id] ?? []).forEach(s => {
				if (s.to_user === userId) totalSettlementsReceived += s.amount;
				if (s.from_user === userId) totalSettlementsSent += s.amount;
			});
		});

		let spendChange: number | null = null;
		if (lastMonthSpend > 0) spendChange = ((currentMonthSpend - lastMonthSpend) / lastMonthSpend) * 100;
		else if (currentMonthSpend > 0) spendChange = 100;

		const totalHistoricalOwedToMe = totalCurrentlyOwedToMe + totalSettlementsReceived;
		let recoveredPercentage = 0;
		if (totalHistoricalOwedToMe > 0) recoveredPercentage = (totalSettlementsReceived / totalHistoricalOwedToMe) * 100;
		else if (totalCurrentlyOwedToMe === 0 && totalSettlementsReceived > 0) recoveredPercentage = 100;

		const totalHistoricalIOwe = totalCurrentlyIOwe + totalSettlementsSent;
		let settledPercentage = 0;
		if (totalHistoricalIOwe > 0) settledPercentage = (totalSettlementsSent / totalHistoricalIOwe) * 100;
		else if (totalCurrentlyIOwe === 0 && totalSettlementsSent > 0) settledPercentage = 100;

		return {
			monthlySpend: parseFloat(currentMonthSpend.toFixed(2)),
			spendChange: spendChange !== null ? parseFloat(spendChange.toFixed(1)) : null,
			topDebtGroupName,
			settledPercentage: Math.round(settledPercentage),
			recoveredPercentage: Math.round(recoveredPercentage),
		};
	},
};

// ── Shared fetch ──────────────────────────────────────────────────────────────
// A single in-flight promise shared between the auto-start prefetch and the page.
// This prevents duplicate requests when both fire at the same time.

export interface BalancePageData {
	groupView:  { owedToMe: GroupBalanceData[]; iOwe: GroupBalanceData[] };
	personView: { owedToMe: PersonBalanceData[]; iOwe: PersonBalanceData[] };
	insights:   FlowInsights;
}

let inflightFetch: Promise<BalancePageData> | null = null;

async function fetchAndCache(userId: string): Promise<BalancePageData> {
	const groups = await balanceService.getGroups();
	const [balancesMap, expensesMap, settlementsMap] = await Promise.all([
		balanceService.getGroupBalancesMap(groups),
		balanceService.getGroupExpensesMap(groups),
		balanceService.getGroupSettlementsMap(groups),
	]);
	const groupView  = balanceService.computeGroupView(userId, groups, balancesMap);
	const personView = balanceService.computePersonView(userId, balancesMap);
	const insights   = balanceService.computeInsights(userId, groups, balancesMap, expensesMap, settlementsMap);
	sessionStorage.setItem(BALANCE_CACHE_KEY, JSON.stringify({ groupView, personView, insights }));
	return { groupView, personView, insights };
}

// Called by the page — reuses the in-flight prefetch if already running.
export const getBalanceData = (userId: string): Promise<BalancePageData> => {
	if (!inflightFetch) {
		inflightFetch = fetchAndCache(userId).finally(() => { inflightFetch = null; });
	}
	return inflightFetch;
};

// Auto-start: fires as soon as this module loads (at app startup).
try {
	const userRaw = localStorage.getItem('sf_user');
	if (userRaw) {
		const userId = JSON.parse(userRaw).id;
		if (!sessionStorage.getItem(BALANCE_CACHE_KEY)) {
			inflightFetch = fetchAndCache(userId).finally(() => { inflightFetch = null; });
		}
	}
} catch { /* silent */ }

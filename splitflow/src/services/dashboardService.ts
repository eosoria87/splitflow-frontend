import { apiClient } from "../utils/apiClient";
import type { RawExpense } from "./groupService";
import formatRelativeTime from "../utils/formatRelativeTime";

export const DASHBOARD_CACHE_KEY = 'sf_dashboard';

// ── Types ────────────────────────────────────────────────────────────────────

interface RawGroup {
	id: string;
	name: string;
	category: string;
	updated_at: string;
}

export interface DashboardGroup {
	id: string;
	name: string;
	category: string;
	updatedAt: string;
	status: 'owed' | 'owe' | 'settled';
	amount: string | null;
}

export interface DashboardActivity {
	key: string;
	personName: string;
	action: string;
	target: string;
	time: string;
	statusText: string;
	statusColor: 'orange' | 'green' | 'teal' | 'slate';
}

export interface OverallBalances {
	totalBalance: number;
	posBalance: number;
	negBalance: number;
	monthlyChange: number | null;
}

// ── Service ──────────────────────────────────────────────────────────────────

export const dashboardService = {

	// Fetch the list of groups the user belongs to
	getGroups: async (): Promise<RawGroup[]> => {
		try {
			const response = await apiClient.get('/groups');
			return response.data.groups ?? [];
		} catch (error) {
			console.error("Error fetching groups:", error);
			return [];
		}
	},

	// Fetch expenses for all groups in a single parallel batch.
	// Returns a map of groupId → expenses so callers can work per-group or flat.
	getGroupExpenses: async (groups: RawGroup[]): Promise<Record<string, RawExpense[]>> => {
		if (groups.length === 0) return {};
		const results = await Promise.allSettled(
			groups.map(g => apiClient.get(`/groups/${g.id}/expenses`))
		);
		const map: Record<string, RawExpense[]> = {};
		results.forEach((res, idx) => {
			map[groups[idx].id] = res.status === 'fulfilled'
				? (res.value.data.expenses ?? [])
				: [];
		});
		return map;
	},

	// Pure transform — no fetching
	getUserGroups: (groups: RawGroup[], groupExpensesMap: Record<string, RawExpense[]> = {}, currentUserId = ''): DashboardGroup[] => {
		return groups.map((g) => {
			const expenses = groupExpensesMap[g.id] ?? [];
			const latestDate = expenses.length > 0
				? expenses.reduce((latest, exp) => exp.created_at > latest ? exp.created_at : latest, expenses[0].created_at)
				: g.updated_at;

			let paid = 0, owes = 0;
			expenses.forEach(exp => {
				if (exp.paid_by === currentUserId) paid += exp.amount;
				const me = exp.participants.find(p => p.user_id === currentUserId);
				if (me) owes += me.share;
			});
			const net = parseFloat((paid - owes).toFixed(2));
			const status: DashboardGroup['status'] = net > 0 ? 'owed' : net < 0 ? 'owe' : 'settled';
			const amount = net !== 0 ? `$${Math.abs(net).toFixed(2)}` : null;

			return {
				id: g.id,
				name: g.name,
				category: g.category || 'other',
				updatedAt: formatRelativeTime(latestDate),
				status,
				amount,
			};
		});
	},

	// Pure compute — takes already-fetched flat expenses list, no API calls
	getRecentActivity: (currentUserId: string, expenses: RawExpense[]): DashboardActivity[] => {
		const sorted = [...expenses].sort(
			(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		);
		return sorted.slice(0, 5).map(expense => {
			const isYou = expense.paid_by === currentUserId;
			const payerName = isYou ? 'You' : expense.payer_name;
			return {
				key: expense.id,
				personName: payerName,
				action: 'added',
				target: expense.description,
				time: new Date(expense.created_at).toLocaleDateString(),
				statusText: isYou
					? `You lent $${expense.amount.toFixed(2)}`
					: `${payerName} paid $${expense.amount.toFixed(2)}`,
				statusColor: isYou ? 'teal' : 'orange',
			};
		});
	},

	// Pure compute — takes the groupExpensesMap, no API calls
	getOverallBalances: (currentUserId: string, groupExpensesMap: Record<string, RawExpense[]>): OverallBalances => {
		let totalBalance = 0, posBalance = 0, negBalance = 0;
		let currentMonthNet = 0, lastMonthNet = 0;

		const now = new Date();
		const currentMonth = now.getMonth(), currentYear = now.getFullYear();
		const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
		const lastMonth = lastMonthDate.getMonth(), lastMonthYear = lastMonthDate.getFullYear();

		Object.values(groupExpensesMap).forEach(expenses => {
			let groupPaid = 0, groupOwes = 0;

			expenses.forEach(expense => {
				if (expense.paid_by === currentUserId) groupPaid += expense.amount;
				const myParticipant = expense.participants.find(p => p.user_id === currentUserId);
				if (myParticipant) groupOwes += myParticipant.share;

				// Monthly change computation
				// Use the date string directly to avoid UTC-midnight parsing shifting
				// "2026-03-01" into Feb 28 in UTC- timezones.
				const rawDate = (expense.date || expense.created_at).substring(0, 10);
				const [expYear, expMonth] = rawDate.split('-').map(Number);
				const isCurrentMonth = expMonth - 1 === currentMonth && expYear === currentYear;
				const isLastMonth = expMonth - 1 === lastMonth && expYear === lastMonthYear;

				if (isCurrentMonth || isLastMonth) {
					const paidAmount = expense.paid_by === currentUserId ? expense.amount : 0;
					const share = myParticipant?.share ?? 0;
					const net = paidAmount - share;
					if (isCurrentMonth) currentMonthNet += net;
					else lastMonthNet += net;
				}
			});

			const groupNet = parseFloat((groupPaid - groupOwes).toFixed(2));
			totalBalance += groupNet;
			if (groupNet > 0) posBalance += groupNet;
			if (groupNet < 0) negBalance += Math.abs(groupNet);
		});

		// Only compute a percentage when last month had at least $1 of activity.
		// Sub-dollar denominators produce misleading 10,000%+ swings.
		const MIN_THRESHOLD = 1;
		let monthlyChange: number | null = null;
		if (Math.abs(lastMonthNet) >= MIN_THRESHOLD) {
			const raw = ((currentMonthNet - lastMonthNet) / Math.abs(lastMonthNet)) * 100;
			// Cap at ±999 so the UI never shows absurd values like +19900%
			monthlyChange = parseFloat(Math.max(-999, Math.min(999, raw)).toFixed(1));
		} else if (Math.abs(currentMonthNet) >= MIN_THRESHOLD) {
			// Nothing last month but activity this month → treat as a full increase
			monthlyChange = 100;
		}

		return {
			totalBalance: parseFloat(totalBalance.toFixed(2)),
			posBalance: parseFloat(posBalance.toFixed(2)),
			negBalance: parseFloat(negBalance.toFixed(2)),
			monthlyChange,
		};
	},
};

// ── Shared fetch ──────────────────────────────────────────────────────────────
// A single in-flight promise shared between the auto-start and the page.
// This prevents duplicate requests when both fire at the same time.

export interface DashboardPageData {
	balances: OverallBalances;
	userGroups: DashboardGroup[];
	recentActivity: DashboardActivity[];
	groups: RawGroup[];
	groupExpensesMap: Record<string, RawExpense[]>;
}

let inflightFetch: Promise<DashboardPageData> | null = null;

async function fetchAndCache(userId: string): Promise<DashboardPageData> {
	const groups = await dashboardService.getGroups();
	const groupExpensesMap = await dashboardService.getGroupExpenses(groups);
	const allExpenses = Object.values(groupExpensesMap).flat();
	const userGroups = dashboardService.getUserGroups(groups, groupExpensesMap, userId);
	const balances = dashboardService.getOverallBalances(userId, groupExpensesMap);
	const recentActivity = dashboardService.getRecentActivity(userId, allExpenses);
	sessionStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify({ balances, userGroups, recentActivity }));
	return { balances, userGroups, recentActivity, groups, groupExpensesMap };
}

// Called by the page — reuses the in-flight prefetch if already running.
export const getDashboardData = (userId: string): Promise<DashboardPageData> => {
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
		if (!sessionStorage.getItem(DASHBOARD_CACHE_KEY)) {
			inflightFetch = fetchAndCache(userId).finally(() => { inflightFetch = null; });
		}
	}
} catch { /* silent */ }

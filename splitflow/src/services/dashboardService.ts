import { apiClient } from "../helper/apiClient";

// ── Types ────────────────────────────────────────────────────────────────────

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

	getUserGroups: async (): Promise<DashboardGroup[]> => {
		try {
			const response = await apiClient.get('/groups');
			const groups = response.data.groups;

			if (!groups) return [];

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return groups.map((g: any) => ({
				id: g.id,
				name: g.name,
				category: g.category || 'other',
				updatedAt: new Date(g.updated_at).toLocaleDateString(),
				status: 'settled', // You can update this later when you link it to the balances!
				amount: '$0.00',
			}));
		} catch (error) {
			console.error("Axios error fetching groups:", error);
			return [];
		}
	},

	getRecentActivity: async (currentUserId: string): Promise<DashboardActivity[]> => {
		try {

			const groupsResponse = await apiClient.get('/groups');
			const groups = groupsResponse.data.groups;

			if (!groups || groups.length === 0) return [];

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const expensePromises = groups.map((g: any) => apiClient.get(`/groups/${g.id}/expenses`));
			const expenseResponses = await Promise.allSettled(expensePromises);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			let allExpenses: any[] = [];
			expenseResponses.forEach((res) => {
				if (res.status === 'fulfilled' && res.value.data.expenses) {
					allExpenses = [...allExpenses, ...res.value.data.expenses];
				}
			});

			allExpenses.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
			const top5Expenses = allExpenses.slice(0, 5);

			return top5Expenses.map(expense => {
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
					statusColor: isYou ? 'teal' : 'orange'
				};
			});
		} catch (error) {
			console.error("Axios error fetching activity:", error);
			return [];
		}
	},

	getOverallBalances: async (currentUserId: string): Promise<OverallBalances> => {
		try {
			const groupsResponse = await apiClient.get('/groups');
			const groups = groupsResponse.data.groups;

			if (!groups || groups.length === 0) {
				return { totalBalance: 0, posBalance: 0, negBalance: 0, monthlyChange: null };
			}

			// 1. Fetch Balances AND Expenses in parallel for all groups
			const balancePromises = groups.map((g: any) => apiClient.get(`/groups/${g.id}/balances`));
			const expensePromises = groups.map((g: any) => apiClient.get(`/groups/${g.id}/expenses`));

			const [balanceResponses, expenseResponses] = await Promise.all([
				Promise.allSettled(balancePromises),
				Promise.allSettled(expensePromises)
			]);

			// 2. Calculate All-Time Totals 
			let posBalance = 0; let negBalance = 0; let totalBalance = 0;

			balanceResponses.forEach((res) => {
				if (res.status === 'fulfilled' && res.value.data.balances) {
					const yourBalance = res.value.data.balances.find((b: any) => b.userId === currentUserId);
					if (yourBalance) {
						const net = yourBalance.netBalance;
						totalBalance += net;
						if (net > 0) posBalance += net;
						if (net < 0) negBalance += Math.abs(net);
					}
				}
			});

			// 3. Calculate Month-Over-Month Change
			let currentMonthNet = 0;
			let lastMonthNet = 0;

			const now = new Date();
			const currentMonth = now.getMonth();
			const currentYear = now.getFullYear();

			const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
			const lastMonth = lastMonthDate.getMonth();
			const lastMonthYear = lastMonthDate.getFullYear();

			expenseResponses.forEach((res) => {
				if (res.status === 'fulfilled' && res.value.data.expenses) {
					res.value.data.expenses.forEach((expense: any) => {
						const expenseDate = new Date(expense.date || expense.created_at);

						const isCurrentMonth = expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
						const isLastMonth = expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;

						if (isCurrentMonth || isLastMonth) {
							const isPayer = expense.paid_by === currentUserId;
							const paidAmount = isPayer ? expense.amount : 0;

							const myParticipantRecord = expense.participants.find((p: any) => p.user_id === currentUserId);
							const myShare = myParticipantRecord ? myParticipantRecord.share : 0;

							const netContribution = paidAmount - myShare;

							if (isCurrentMonth) currentMonthNet += netContribution;
							if (isLastMonth) lastMonthNet += netContribution;
						}
					});
				}
			});

			let monthlyChange: number | null = null;
			if (lastMonthNet !== 0) {
				monthlyChange = ((currentMonthNet - lastMonthNet) / Math.abs(lastMonthNet)) * 100;
			} else if (currentMonthNet !== 0 && lastMonthNet === 0) {
				monthlyChange = 100;
			}

			return { totalBalance, posBalance, negBalance, monthlyChange };
		} catch (error) {
			console.error("Axios error fetching balances:", error);
			return { totalBalance: 0, posBalance: 0, negBalance: 0, monthlyChange: null };
		}
	}
};





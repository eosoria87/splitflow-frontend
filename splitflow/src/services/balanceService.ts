import { apiClient } from "../utils/apiClient";

export interface FlowInsights {
	monthlySpend: number;
	spendChange: number | null;
	topDebtGroupName: string;
	settledPercentage: number;
	recoveredPercentage: number;
}

export interface GroupBalanceData {
	id: string;
	name: string;
	category: string;
	amount: number;
	type: 'owed-to-me' | 'i-owe';
}

export interface GroupBalancesResult {
	owedToMe: GroupBalanceData[];
	iOwe: GroupBalanceData[];
	totalOwedToMe: number;
	totalIOwe: number;
}

export interface PersonBalanceData {
	id: string; // The other user's ID
	name: string;
	amount: number;
	type: 'owed-to-me' | 'i-owe';
}

export interface PersonBalancesResult {
	owedToMe: PersonBalanceData[];
	iOwe: PersonBalanceData[];
	totalOwedToMe: number;
	totalIOwe: number;
}

export const balanceService = {

	getBalancesByGroup: async (currentUserId: string): Promise<GroupBalancesResult> => {
		try {
			const groupsResponse = await apiClient.get('/groups');
			const groups = groupsResponse.data.groups;

			const owedToMe: GroupBalanceData[] = [];
			const iOwe: GroupBalanceData[] = [];
			let totalOwedToMe = 0;
			let totalIOwe = 0;

			if (!groups || groups.length === 0) {
				return { owedToMe, iOwe, totalOwedToMe, totalIOwe };
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const balancePromises = groups.map((g: any) => apiClient.get(`/groups/${g.id}/balances`));
			const balanceResponses = await Promise.allSettled(balancePromises);

			balanceResponses.forEach((res, index) => {
				if (res.status === 'fulfilled' && res.value.data.balances) {
					const group = groups[index];

					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const yourBalance = res.value.data.balances.find((b: any) => b.userId === currentUserId);

					if (yourBalance) {
						const net = yourBalance.netBalance;

						if (net > 0) {
							owedToMe.push({
								id: group.id,
								name: group.name,
								category: group.category || 'other',
								amount: net,
								type: 'owed-to-me'
							});
							totalOwedToMe += net;
						} else if (net < 0) {
							iOwe.push({
								id: group.id,
								name: group.name,
								category: group.category || 'other',
								amount: Math.abs(net), // UI expects positive numbers!
								type: 'i-owe'
							});
							totalIOwe += Math.abs(net);
						}
					}
				}
			});

			return { owedToMe, iOwe, totalOwedToMe, totalIOwe };

		} catch (error) {
			console.error("Axios error fetching group balances:", error);
			return { owedToMe: [], iOwe: [], totalOwedToMe: 0, totalIOwe: 0 };
		}
	},

	getBalancesByPerson: async (currentUserId: string): Promise<PersonBalancesResult> => {
		try {
			const groupsResponse = await apiClient.get('/groups');
			const groups = groupsResponse.data.groups;

			if (!groups || groups.length === 0) {
				return { owedToMe: [], iOwe: [], totalOwedToMe: 0, totalIOwe: 0 };
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const suggestionPromises = groups.map((g: any) => apiClient.get(`/groups/${g.id}/settlements/suggestions`));
			const suggestionResponses = await Promise.allSettled(suggestionPromises);

			const personLedger: Record<string, { name: string, netAmount: number }> = {};

			suggestionResponses.forEach((res) => {
				if (res.status === 'fulfilled' && res.value.data.settlements) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					res.value.data.settlements.forEach((settlement: any) => {

						// Scenario A: Someone owes YOU money
						if (settlement.to === currentUserId) {
							const debtorId = settlement.from;
							if (!personLedger[debtorId]) personLedger[debtorId] = { name: settlement.from_name, netAmount: 0 };
							personLedger[debtorId].netAmount += settlement.amount;
						}

						// Scenario B: YOU owe someone money
						if (settlement.from === currentUserId) {
							const creditorId = settlement.to;
							if (!personLedger[creditorId]) personLedger[creditorId] = { name: settlement.to_name, netAmount: 0 };
							personLedger[creditorId].netAmount -= settlement.amount;
						}
					});
				}
			});

			const owedToMe: PersonBalanceData[] = [];
			const iOwe: PersonBalanceData[] = [];
			let totalOwedToMe = 0;
			let totalIOwe = 0;

			Object.entries(personLedger).forEach(([personId, data]) => {
				if (data.netAmount > 0.01) {
					owedToMe.push({
						id: personId,
						name: data.name,
						amount: data.netAmount,
						type: 'owed-to-me'
					});
					totalOwedToMe += data.netAmount;
				} else if (data.netAmount < -0.01) {
					iOwe.push({
						id: personId,
						name: data.name,
						amount: Math.abs(data.netAmount),
						type: 'i-owe'
					});
					totalIOwe += Math.abs(data.netAmount);
				}
			});

			return { owedToMe, iOwe, totalOwedToMe, totalIOwe };

		} catch (error) {
			console.error("Axios error fetching person balances:", error);
			return { owedToMe: [], iOwe: [], totalOwedToMe: 0, totalIOwe: 0 };
		}
	},

	getFlowInsights: async (currentUserId: string): Promise<FlowInsights> => {
		try {
			// 1. Fetch all groups
			const groupsResponse = await apiClient.get('/groups');
			const groups = groupsResponse.data.groups;

			if (!groups || groups.length === 0) {
				return { monthlySpend: 0, spendChange: null, topDebtGroupName: 'None', settledPercentage: 0, recoveredPercentage: 0 };
			}

			// 2. Fetch EVERYTHING we need in parallel
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const expensePromises = groups.map((g: any) => apiClient.get(`/groups/${g.id}/expenses`));
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const settlementPromises = groups.map((g: any) => apiClient.get(`/groups/${g.id}/settlements`));
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const balancePromises = groups.map((g: any) => apiClient.get(`/groups/${g.id}/balances`));

			const [expenseRes, settlementRes, balanceRes] = await Promise.all([
				Promise.allSettled(expensePromises),
				Promise.allSettled(settlementPromises),
				Promise.allSettled(balancePromises)
			]);

			// Variables for our math
			let currentMonthSpend = 0;
			let lastMonthSpend = 0;

			let totalSettlementsReceived = 0;
			let totalSettlementsSent = 0;

			let totalCurrentlyOwedToMe = 0;
			let totalCurrentlyIOwe = 0;

			let highestDebt = 0;
			let topDebtGroupName = 'None';

			const now = new Date();
			const currentMonth = now.getMonth();
			const currentYear = now.getFullYear();

			const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
			const lastMonth = lastMonthDate.getMonth();
			const lastMonthYear = lastMonthDate.getFullYear();

			// --- A. Calculate Spend ---
			expenseRes.forEach((res) => {
				if (res.status === 'fulfilled' && res.value.data.expenses) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					res.value.data.expenses.forEach((expense: any) => {
						const expenseDate = new Date(expense.date || expense.created_at);
						const isCurrentMonth = expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
						const isLastMonth = expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;

						if (isCurrentMonth || isLastMonth) {
							// Find your exact share of the expense
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const myParticipantRecord = expense.participants.find((p: any) => p.user_id === currentUserId);
							const myShare = myParticipantRecord ? myParticipantRecord.share : 0;

							if (isCurrentMonth) currentMonthSpend += myShare;
							if (isLastMonth) lastMonthSpend += myShare;
						}
					});
				}
			});

			// --- B. Calculate Settlements (History) ---
			settlementRes.forEach((res) => {
				if (res.status === 'fulfilled' && res.value.data.settlements) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					res.value.data.settlements.forEach((settlement: any) => {
						if (settlement.to_user === currentUserId) totalSettlementsReceived += settlement.amount;
						if (settlement.from_user === currentUserId) totalSettlementsSent += settlement.amount;
					});
				}
			});

			// --- C. Calculate Balances & Top Debt Group ---
			balanceRes.forEach((res, index) => {
				if (res.status === 'fulfilled' && res.value.data.balances) {
					const group = groups[index];
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const myBalance = res.value.data.balances.find((b: any) => b.userId === currentUserId);

					if (myBalance) {
						const net = myBalance.netBalance;
						if (net > 0) {
							totalCurrentlyOwedToMe += net;
						} else if (net < 0) {
							const debtAmount = Math.abs(net);
							totalCurrentlyIOwe += debtAmount;

							// Track the group where you owe the most
							if (debtAmount > highestDebt) {
								highestDebt = debtAmount;
								topDebtGroupName = group.name;
							}
						}
					}
				}
			});

			// --- D. Final Percentages Math ---
			let spendChange: number | null = null;
			if (lastMonthSpend > 0) spendChange = ((currentMonthSpend - lastMonthSpend) / lastMonthSpend) * 100;
			else if (currentMonthSpend > 0 && lastMonthSpend === 0) spendChange = 100;

			// Recovered % (Credits received vs Total Credits)
			const totalHistoricalOwedToMe = totalCurrentlyOwedToMe + totalSettlementsReceived;
			let recoveredPercentage = 0;
			if (totalHistoricalOwedToMe > 0) recoveredPercentage = (totalSettlementsReceived / totalHistoricalOwedToMe) * 100;
			else if (totalCurrentlyOwedToMe === 0 && totalSettlementsReceived > 0) recoveredPercentage = 100;

			// Settled % (Debts paid vs Total Debts)
			const totalHistoricalIOwe = totalCurrentlyIOwe + totalSettlementsSent;
			let settledPercentage = 0;
			if (totalHistoricalIOwe > 0) settledPercentage = (totalSettlementsSent / totalHistoricalIOwe) * 100;
			else if (totalCurrentlyIOwe === 0 && totalSettlementsSent > 0) settledPercentage = 100;

			return {
				monthlySpend: currentMonthSpend,
				spendChange,
				topDebtGroupName,
				settledPercentage: Math.round(settledPercentage),
				recoveredPercentage: Math.round(recoveredPercentage)
			};

		} catch (error) {
			console.error("Error fetching flow insights:", error);
			return { monthlySpend: 0, spendChange: null, topDebtGroupName: 'None', settledPercentage: 0, recoveredPercentage: 0 };
		}
	}
};

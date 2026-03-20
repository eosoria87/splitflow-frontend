import { apiClient } from "../utils/apiClient";
import { type Group } from "./groupService";

export interface ExpenseLog {
	id: string;
	date: string;
	time: string;
	description: string;
	group: string;
	category: string;
	payerName: string;
	payerId: string;
	payerAvatar?: string;
	amount: number;
	status: string;
	rawDate: Date;
}

export interface ExpenseKPIs {
	totalVolume: number;
	youPaid: number;
	totalTransactions: number;
	activeGroups: number;
}

export interface Expense {
  id: string;                 
  group_id: string;           
  description: string;
  amount: number;            
  paid_by: string;          
  payer_name: string;         
  payer_email: string;        
  category: 'food' | 'transport' | 'accommodation' | 'entertainment' | 'utilities' | 'other' | null;
  date: string;           
  created_at: string;      
  updated_at?: string;     
  
}


export const expenseService = {
	getAllUserExpenses: async (currentUserId: string): Promise<{ logs: ExpenseLog[], kpis: ExpenseKPIs }> => {
		try {
			// 1. Fetch all groups
			const groupsRes = await apiClient.get('/groups');
			const groups = groupsRes.data.groups || [];

			if (groups.length === 0) {
				return { logs: [], kpis: { totalVolume: 0, youPaid: 0, totalTransactions: 0, activeGroups: 0 } };
			}

			// 2. Fetch expenses for all groups in parallel
			const expensePromises = groups.map((g: Group) =>
				apiClient.get(`/groups/${g.id}/expenses`).then(res => ({
					groupName: g.name,
					expenses: res.data.expenses || []
				}))
			);

			const results = await Promise.allSettled(expensePromises);

			const allExpenses: ExpenseLog[] = [];
			let totalVolume = 0;
			let youPaid = 0;
			const activeGroupsSet = new Set<string>();

			// 3. Process and format the data
			results.forEach(res => {
				if (res.status === 'fulfilled') {
					const { groupName, expenses } = res.value;

					if (expenses.length > 0) activeGroupsSet.add(groupName);

					expenses.forEach((e: Expense) => {
						const dateObj = new Date(e.created_at || e.date);
						const amount = Number(e.amount) || 0;

						totalVolume += amount;
						if (e.paid_by === currentUserId) {
							youPaid += amount;
						}

						allExpenses.push({
							id: e.id,
							date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
							time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
							description: e.description,
							group: groupName,
							category: e.category || 'other',
							payerName: e.payer_name || 'Someone',
							payerId: e.paid_by,
							amount: amount,
							status: 'Completed', // Defaulting to completed since they are recorded
							rawDate: dateObj
						});
					});
				}
			});

			// 4. Sort newest first
			allExpenses.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

			return {
				logs: allExpenses,
				kpis: {
					totalVolume,
					youPaid,
					totalTransactions: allExpenses.length,
					activeGroups: activeGroupsSet.size
				}
			};
		} catch (error) {
			console.error("Error fetching all expenses:", error);
			return { logs: [], kpis: { totalVolume: 0, youPaid: 0, totalTransactions: 0, activeGroups: 0 } };
		}
	}
};

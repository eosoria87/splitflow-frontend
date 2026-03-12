import { supabase } from "../helper/supabaseClient";

export interface OverallBalances {
    totalBalance: number;
    posBalance: number;
    negBalance: number;
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

export const dashboardService = {

	getOverallBalances: async (userId: string): Promise<OverallBalances> => {
		try {
			// 1. Fetch expenses the user paid for entirely
			const { data: expensesPaid } = await supabase
				.from('expenses')
				.select('group_id, amount')
				.eq('paid_by', userId);

			// 2. Fetch the user's specific share of expenses
			// We use an inner join to get the group_id from the linked expenses table
			const { data: userShares } = await supabase
				.from('expense_participants')
				.select(`
                    share,
                    expenses!inner ( group_id )
                `)
				.eq('user_id', userId);

			// 3. Fetch settlements the user sent (paid back)
			const { data: settlementsSent } = await supabase
				.from('settlements')
				.select('group_id, amount')
				.eq('from_user', userId);

			// 4. Fetch settlements the user received
			const { data: settlementsReceived } = await supabase
				.from('settlements')
				.select('group_id, amount')
				.eq('to_user', userId);

			// --- THE MATH ---
			// We use a dictionary to track the balance per group (e.g., { "group-uuid-1": 45.50, "group-uuid-2": -12.00 })
			const groupBalances: Record<string, number> = {};

			const addToGroup = (groupId: string, amount: number) => {
				if (!groupBalances[groupId]) groupBalances[groupId] = 0;
				groupBalances[groupId] += amount;
			};

			// Apply our formula: Paid - Share + Settlements Sent - Settlements Received
			expensesPaid?.forEach(e => addToGroup(e.group_id, Number(e.amount)));

			userShares?.forEach(s => {
				// Because of the join, expenses is an object/array. We safely extract the group_id.
				const groupId = Array.isArray(s.expenses) ? s.expenses[0].group_id : s.expenses.group_id;
				addToGroup(groupId, -Number(s.share));
			});

			settlementsSent?.forEach(s => addToGroup(s.group_id, Number(s.amount)));
			settlementsReceived?.forEach(s => addToGroup(s.group_id, -Number(s.amount)));

			// Now we aggregate all the groups into our three final numbers
			let posBalance = 0;
			let negBalance = 0;
			let totalBalance = 0;

			Object.values(groupBalances).forEach(balance => {
				if (balance > 0) {
					posBalance += balance; // Money owed to you
				} else if (balance < 0) {
					negBalance += Math.abs(balance); // Money you owe
				}
				totalBalance += balance;
			});

			console.log("Calculated Balances:", { totalBalance, posBalance, negBalance });

			return { totalBalance, posBalance, negBalance };

		} catch (error) {
			console.error("Error calculating balances:", error);
			return { totalBalance: 0, posBalance: 0, negBalance: 0 };
		}
	},

	getUserGroups: async (userId: string): Promise<DashboardGroup[]> => {

		const { data, error } = await supabase
			.from('group_members')
			.select(`
                group_id,
                groups (
                    id,
                    name,
                    category,
                    updated_at
                )
            `)
			.eq('user_id', userId);

		if (error) {
			console.error("Supabase error fetching groups:", error);
			return [];
		}

		if (!data || data.length === 0) return [];

		console.log ("dashboardService rawdata: ", data);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const formattedGroups: DashboardGroup[] = data.map((row: any) => {
			const groupData = row.groups;

			const formattedDate = groupData.updated_at
				? new Date(groupData.updated_at).toLocaleDateString()
				: "Recently";

			return {
				id: groupData.id,
				name: groupData.name,
				category: groupData.category || 'other',
				updatedAt: formattedDate,

				status: 'settled',
				amount: '$0.00',

			};
		});

		return formattedGroups;
	},

	getRecentActivity: async (userId: string): Promise<DashboardActivity[]> => {
		
		const { data: memberData, error: memberError } = await supabase
			.from('group_members')
			.select('group_id')
			.eq('user_id', userId);

		if (memberError) {
			console.error("Error fetching user's group memberships:", memberError);
			return [];
		}

		const groupIds = memberData?.map(m => m.group_id) || [];
		console.log("Step 1: User's Group IDs:", groupIds);

		if (groupIds.length === 0) return [];

		const { data: expensesData, error: expensesError } = await supabase
			.from('expenses')
			.select(`
						id,
						description,
						amount,
						created_at,
						paid_by
						`)
			.in('group_id', groupIds)
			.order('created_at', { ascending: false })
			.limit(5);

		if (expensesError) {
			console.log("Supabase error fetching expenses:", expensesError);
			return [];
		}

		console.log("Step 2: Raw Expenses Data:", expensesData);
		if (!expensesData || expensesData.length === 0) return [];

		const uniquePayerIds = [...new Set(expensesData.map(exp => exp.paid_by))];

		const { data: profilesData, error: profilesError } = await supabase
			.from('profiles')
			.select('id, name')
			.in('id', uniquePayerIds);

		if (profilesError) {
			console.error("Error fetching profiles:", profilesError);
		}
		console.log("Step 3: Fetched Profiles: ", profilesData);

		const profileLookup: Record<string, string> = {};
		profilesData?.forEach(profile => {
			profileLookup[profile.id] = profile.name;
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const formattedActivity: DashboardActivity[] = expensesData.map((expense: any) => {
			const isYou = expense.paid_by === userId;
			const payerName = isYou ? 'You' : (profileLookup[expense.paid_by] || 'Someone');
			const formattedTime = new Date(expense.created_at).toLocaleDateString();

			return {
				key: expense.id,
				personName: payerName,
				action: 'added',
				target: expense.description,
				time: formattedTime,
				statusText: isYou
					? `You lent $${expense.amount.toFixed(2)}`
					: `${payerName} paid $${expense.amount.toFixed(2)}`,
				statusColor: isYou ? 'teal' : 'orange'
			};
		});
		console.log("Step 4: Final Mapped Activity:", formattedActivity);
		return formattedActivity;
	},


};





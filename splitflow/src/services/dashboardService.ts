import { supabase } from "../helper/supabaseClient";
import  type { GroupCardType } from "../components/dashboard/GroupCard";

const getCategoryStyles = (category?: string) => {
    switch (category?.toLowerCase()) {
        case 'trip': return 'bg-blue-50 text-blue-500';
        case 'travel': return 'bg-blue-50 text-blue-500';
        case 'home': return 'bg-indigo-50 text-indigo-500';
        case 'couple': return 'bg-pink-50 text-pink-500';
        case 'friends': return 'bg-yellow-50 text-yellow-500';
        case 'other': 
        default: 
            return 'bg-slate-100 text-slate-500'; 
    }
};

export const dashboardService = {

	getUserGroups: async (userId: string): Promise<GroupCardType[] | null> => {

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
			return null;
		}

		if (!data || data.length === 0) return [];

		console.log ("dashboardService rawdata: ", data);

		const formattedGroups: GroupCardType[] = data.map((row: any) => {
			const groupData = row.groups;

			const formattedDate = groupData.updated_at
				? new Date(groupData.updated_at).toLocaleDateString()
				: "Recently";

			return {
				key: groupData.id,
				name: groupData.name,
				category: groupData.category,
				updated_at: formattedDate,
				iconBgClass: getCategoryStyles(groupData.category),

				status: 'settled',
				amount: '$0.00',

			};
		});

		return formattedGroups;
	}


};



        

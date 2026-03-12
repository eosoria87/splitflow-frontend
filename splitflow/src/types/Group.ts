
export interface GroupMember {

	id: string;
	group_id: string;
	user_id: string;
	role: 'Admin' | 'Member' | 'Pending';
	joined_at?: string;
}

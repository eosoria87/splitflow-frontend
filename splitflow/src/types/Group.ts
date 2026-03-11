import type { ReactNode } from "react";

export interface GroupCardType {
	icon?: ReactNode;
	iconBgClass?: string;
	status: 'owed' | 'owe' | 'settled';
  amount?: string | null;

	name: string;
	key: string;
	updated_at?: string;
	category?: string;

}


export interface GroupMember {

	id: string;
	group_id: string;
	user_id: string;
	role: 'Admin' | 'Member' | 'Pending';
	joined_at?: string;
}

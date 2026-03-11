export interface Member {

	id: string;
	name: string;
	email: string;
	avatar: string;
	role: 'Admin' | 'Member' | 'Pending';
	status: 'online' | 'idle' | 'offline';
}

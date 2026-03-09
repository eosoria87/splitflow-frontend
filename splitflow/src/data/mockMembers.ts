import type { Member } from "../types/Member";

export const mockMembers: Member[] = [
	{ id: '1', name: 'Alex M (You)', email: 'alex@splitflow.com', avatar: 'https://i.pravatar.cc/150?img=11', role: 'Admin', status: 'online' },
	{ id: '2', name: 'Sarah J', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?img=5', role: 'Member', status: 'online' },
	{ id: '3', name: 'John Doe', email: 'john.doe@test.com', avatar: '', role: 'Pending', status: 'idle' }
]

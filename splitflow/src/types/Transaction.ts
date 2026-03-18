export type TransactionCategory = 'food' | 'transport' | 'accommodation' | 'shopping' | 'entertainment' | 'utilities' | 'other';
export type GroupCategory = 'travel' | 'home' | 'couple' | 'friends' | 'other';
export type TransactionStatus = 'you owe' | 'you lent' | 'not involved';

export interface GroupTransaction {
	id: string;
	title: string;
	category: TransactionCategory; 
	paidBy: string;
	totalAmount: number;
	splitDetails: string;
	userNetChange: number; 
	userStatus: TransactionStatus;
}

export interface TransactionGroup {
	dateLabel: string;
	dailyTotal: number; 
	transactions: GroupTransaction[];
}

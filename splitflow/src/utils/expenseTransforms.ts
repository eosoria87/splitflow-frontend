import type { TransactionCategory, TransactionStatus } from '../types/Transaction';
import formatDateLabel from './formatDateLabel';

const VALID_CATEGORIES: TransactionCategory[] = [
	'food', 'transport', 'accommodation', 'shopping', 'entertainment', 'utilities', 'other',
];

export const toCategory = (cat: string | null): TransactionCategory =>
	VALID_CATEGORIES.includes(cat as TransactionCategory) ? (cat as TransactionCategory) : 'other';

interface RawParticipant { user_id: string; share: number; }

export interface RawExpenseInput {
	id: string;
	description: string;
	amount: number;
	paid_by: string;
	payer_name: string;
	category: string | null;
	date: string;
	created_at: string;
	participants: RawParticipant[];
	participants_count: number;
}

export interface RawGroupInput { id: string; name: string; }

export interface MappedExpense {
	id: string;
	description: string;
	amount: number;
	paidBy: string;
	category: TransactionCategory;
	date: string;
	groupId: string;
	groupName: string;
	userNetChange: number;
	userStatus: TransactionStatus;
	participantsCount: number;
}

export interface ExpenseDateGroup {
	date: string;
	dateLabel: string;
	dailyTotal: number;
	expenses: MappedExpense[];
}

export const toMappedExpense = (
	raw: RawExpenseInput,
	group: RawGroupInput,
	currentUserId: string,
): MappedExpense => {
	const participant = raw.participants.find(p => p.user_id === currentUserId);
	const isPayer = raw.paid_by === currentUserId;
	let userNetChange = 0;
	let userStatus: TransactionStatus = 'not involved';

	if (participant) {
		if (isPayer) {
			userNetChange = raw.amount - participant.share;
			userStatus = 'you lent';
		} else {
			userNetChange = -participant.share;
			userStatus = 'you owe';
		}
	}

	return {
		id: raw.id,
		description: raw.description,
		amount: raw.amount,
		paidBy: raw.payer_name,
		category: toCategory(raw.category),
		date: (raw.date || raw.created_at).substring(0, 10),
		groupId: group.id,
		groupName: group.name,
		userNetChange,
		userStatus,
		participantsCount: raw.participants_count,
	};
};

export const groupExpensesByDate = (expenses: MappedExpense[]): ExpenseDateGroup[] => {
	const byDate: Record<string, MappedExpense[]> = {};
	expenses.forEach(exp => {
		if (!byDate[exp.date]) byDate[exp.date] = [];
		byDate[exp.date].push(exp);
	});
	return Object.entries(byDate)
		.sort(([a], [b]) => b.localeCompare(a))
		.map(([date, exps]) => ({
			date,
			dateLabel: formatDateLabel(date),
			dailyTotal: exps.reduce((sum, e) => sum + e.amount, 0),
			expenses: exps,
		}));
};

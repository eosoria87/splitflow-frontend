import { apiClient } from '../utils/apiClient';
import type { TransactionCategory } from '../types/Transaction';
import { toMappedExpense, groupExpensesByDate, type MappedExpense, type ExpenseDateGroup, type RawExpenseInput } from '../utils/expenseTransforms';

// ── Types ─────────────────────────────────────────────────────────────────────

interface RawGroup { id: string; name: string; }

export type AllExpense = MappedExpense;
export type AllExpenseDateGroup = ExpenseDateGroup;

export interface AllExpensesData {
	dateGroups: AllExpenseDateGroup[];
	groups: { id: string; name: string }[];
}

export interface AllExpensesSummary {
	totalExpenses: number;
	totalLent: number;
	totalOwed: number;
	net: number;
}

export interface ExpenseFilters {
	search: string;
	groupId: string;
	status: 'all' | 'you owe' | 'you lent';
	category: TransactionCategory | 'all';
}

export const DEFAULT_FILTERS: ExpenseFilters = {
	search: '',
	groupId: '',
	status: 'all',
	category: 'all',
};

// ── API ───────────────────────────────────────────────────────────────────────

const fetchGroups = async (): Promise<RawGroup[]> => {
	const res = await apiClient.get('/groups');
	return res.data.groups ?? [];
};

const fetchExpensesForGroups = async (groups: RawGroup[]): Promise<Record<string, RawExpenseInput[]>> => {
	if (groups.length === 0) return {};
	const results = await Promise.allSettled(
		groups.map(g => apiClient.get(`/groups/${g.id}/expenses`))
	);
	const map: Record<string, RawExpenseInput[]> = {};
	results.forEach((res, idx) => {
		map[groups[idx].id] = res.status === 'fulfilled' ? (res.value.data.expenses ?? []) : [];
	});
	return map;
};

// ── Public API ────────────────────────────────────────────────────────────────

export const getAllExpensesData = async (currentUserId: string): Promise<AllExpensesData> => {
	const groups = await fetchGroups();
	const expensesMap = await fetchExpensesForGroups(groups);

	const allExpenses = groups.flatMap(group =>
		(expensesMap[group.id] ?? []).map(raw => toMappedExpense(raw, group, currentUserId))
	);

	return {
		dateGroups: groupExpensesByDate(allExpenses),
		groups: groups.map(g => ({ id: g.id, name: g.name })),
	};
};

export const applyFilters = (
	dateGroups: AllExpenseDateGroup[],
	filters: ExpenseFilters,
): AllExpenseDateGroup[] => {
	const searchLower = filters.search.toLowerCase();
	return dateGroups
		.map(group => ({
			...group,
			expenses: group.expenses.filter(exp => {
				if (searchLower && !exp.description.toLowerCase().includes(searchLower)) return false;
				if (filters.groupId && exp.groupId !== filters.groupId) return false;
				if (filters.status !== 'all' && exp.userStatus !== filters.status) return false;
				if (filters.category !== 'all' && exp.category !== filters.category) return false;
				return true;
			}),
		}))
		.filter(group => group.expenses.length > 0);
};

export const computeSummary = (dateGroups: AllExpenseDateGroup[]): AllExpensesSummary => {
	const expenses = dateGroups.flatMap(g => g.expenses);
	let totalLent = 0, totalOwed = 0;
	expenses.forEach(exp => {
		if (exp.userStatus === 'you lent') totalLent += exp.userNetChange;
		if (exp.userStatus === 'you owe') totalOwed += Math.abs(exp.userNetChange);
	});
	return {
		totalExpenses: expenses.length,
		totalLent: parseFloat(totalLent.toFixed(2)),
		totalOwed: parseFloat(totalOwed.toFixed(2)),
		net: parseFloat((totalLent - totalOwed).toFixed(2)),
	};
};

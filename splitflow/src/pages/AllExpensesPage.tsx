import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Card from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";
import {
	getAllExpensesData,
	applyFilters,
	computeSummary,
	DEFAULT_FILTERS,
	type AllExpenseDateGroup,
	type ExpenseFilters,
} from "../services/allExpensesService";
import AllExpenseItem from "../components/expenses/AllExpenseItem";
import ExpenseSummaryBar from "../components/expenses/ExpenseSummaryBar";
import ExpenseFilterBar from "../components/expenses/ExpenseFilterBar";

const AllExpensesPage = () => {
	const { user, isLoading: authLoading } = useAuth();

	const [isFetching, setIsFetching] = useState(true);
	const [dateGroups, setDateGroups] = useState<AllExpenseDateGroup[]>([]);
	const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
	const [filters, setFilters] = useState<ExpenseFilters>(DEFAULT_FILTERS);

	useEffect(() => {
		if (!user) return;
		getAllExpensesData(user.id)
			.then(data => {
				setDateGroups(data.dateGroups);
				setGroups(data.groups);
			})
			.finally(() => setIsFetching(false));
	}, [user]);

	const availableCategories = useMemo(
		() => [...new Set(dateGroups.flatMap(g => g.expenses.map(e => e.category)))],
		[dateGroups],
	);

	const filteredGroups = useMemo(
		() => applyFilters(dateGroups, filters),
		[dateGroups, filters],
	);

	const summary = useMemo(
		() => computeSummary(filteredGroups),
		[filteredGroups],
	);

	if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
	if (!user) return <div className="min-h-screen flex items-center justify-center">Please log in.</div>;

	return (
		<div className="min-h-screen flex">
			<Sidebar />
			<main className="flex-1 flex flex-col min-h-screen">
				<Header
					title="All Expenses"
					subtitle="Every expense across all your groups"
					customAction={<></>}
				/>

				<div className="px-4 sm:px-8 pb-12 flex flex-col gap-6">
					<ExpenseSummaryBar summary={summary} isLoading={isFetching} />

					<ExpenseFilterBar filters={filters} groups={groups} availableCategories={availableCategories} onChange={setFilters} />

					{isFetching ? (
						<Card className="p-0 overflow-hidden">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-0">
									<div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse shrink-0" />
									<div className="flex-1 space-y-2">
										<div className="h-4 bg-slate-100 animate-pulse rounded w-1/3" />
										<div className="h-3 bg-slate-100 animate-pulse rounded w-1/2" />
									</div>
									<div className="h-4 w-14 bg-slate-100 animate-pulse rounded" />
								</div>
							))}
						</Card>
					) : filteredGroups.length === 0 ? (
						<Card>
							<p className="text-sm text-slate-400 text-center py-8">
								{dateGroups.length === 0
									? 'No expenses found.'
									: 'No expenses match your filters.'}
							</p>
						</Card>
					) : (
						<Card className="p-0 overflow-hidden">
							<div className="flex flex-col divide-y divide-slate-100">
								{filteredGroups.map(group => (
									<div key={group.date}>
										<div className="flex justify-between items-center px-4 sm:px-6 py-2 bg-slate-50/50 border-b border-slate-100">
											<h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
												{group.dateLabel}
											</h3>
											<span className="text-[10px] font-bold text-teal-500">
												Total: ${group.dailyTotal.toFixed(2)}
											</span>
										</div>
										<div className="divide-y divide-slate-100">
											{group.expenses.map(expense => (
												<AllExpenseItem key={expense.id} expense={expense} />
											))}
										</div>
									</div>
								))}
							</div>
						</Card>
					)}
				</div>
			</main>
		</div>
	);
};

export default AllExpensesPage;

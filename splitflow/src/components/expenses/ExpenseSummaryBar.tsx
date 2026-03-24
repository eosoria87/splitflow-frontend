import type { AllExpensesSummary } from "../../services/allExpensesService";

interface Props {
	summary: AllExpensesSummary;
	isLoading: boolean;
}

interface StatProps {
	label: string;
	value: string;
	color?: string;
}

const Stat = ({ label, value, color = 'text-slate-900' }: StatProps) => (
	<div>
		<p className="text-[10px] uppercase tracking-widest font-medium text-slate-400">{label}</p>
		<p className={`text-xl font-black mt-0.5 ${color}`}>{value}</p>
	</div>
);

const SkeletonStat = () => (
	<div>
		<div className="h-3 w-16 bg-slate-200 animate-pulse rounded mb-2" />
		<div className="h-6 w-20 bg-slate-200 animate-pulse rounded" />
	</div>
);

const ExpenseSummaryBar = ({ summary, isLoading }: Props) => {
	const netColor = summary.net >= 0 ? 'text-teal-500' : 'text-orange-500';
	const netPrefix = summary.net >= 0 ? '+' : '-';

	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
			{isLoading ? (
				Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)
			) : (
				<>
					<Stat label="Total Expenses" value={`${summary.totalExpenses}`} />
					<Stat label="You Lent" value={`+$${summary.totalLent.toFixed(2)}`} color="text-teal-500" />
					<Stat label="You Owe" value={`-$${summary.totalOwed.toFixed(2)}`} color="text-orange-500" />
					<Stat label="Net" value={`${netPrefix}$${Math.abs(summary.net).toFixed(2)}`} color={netColor} />
				</>
			)}
		</div>
	);
};

export default ExpenseSummaryBar;

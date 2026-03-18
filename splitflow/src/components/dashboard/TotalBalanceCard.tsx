import Card from "../ui/Card";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/16/solid";

interface Props {
	totalBalance: number;
	posBalance: number;
	negBalance: number;
	membersCount: number;
	memberNames: string[];
	monthlyChange?: number | null;
}

const avatarColors = [
	"bg-slate-700 text-white",
	"bg-teal-100 text-teal-700",
	"bg-orange-100 text-orange-700",
];

const formatAmount = (n: number) =>
	n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const TotalBalanceCard = ({ totalBalance, posBalance, negBalance, membersCount, memberNames, monthlyChange = null }: Props) => {

	let badgeColor = "bg-slate-100 text-slate-500";
	let badgeText = "New this month";

	if (monthlyChange !== null) {
		if (monthlyChange > 0) {
			badgeColor = "bg-teal-50 text-teal-600";
			badgeText = `+${monthlyChange.toFixed(0)}% this month`;
		} else if (monthlyChange < 0) {
			badgeColor = "bg-red-50 text-red-500";
			badgeText = `${monthlyChange.toFixed(0)}% this month`;
		} else {
			badgeColor = "bg-slate-100 text-slate-500";
			badgeText = "No change";
		}
	}

	const isPositive = totalBalance >= 0;

	return (
		<Card className="p-6 sm:p-8">

			{/* ── Main row: balance left, boxes right ── */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">

				{/* Left: balance info */}
				<div className="min-w-0">
					<p className="text-[11px] text-left font-semibold text-slate-400 uppercase tracking-widest mb-2">
						Total Balance
					</p>
					<div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-1.5">
						<span className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${isPositive ? 'text-slate-900' : 'text-red-500'}`}>
							{isPositive ? '+' : '-'}${formatAmount(Math.abs(totalBalance))}
						</span>
						<span className={`${badgeColor} text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap`}>
							{badgeText}
						</span>
					</div>
					<p className="text-sm text-left text-slate-400">
						You are overall in the{' '}
						<span className={isPositive ? 'text-teal-600 font-medium' : 'text-red-500 font-medium'}>
							{isPositive ? 'green' : 'red'}
						</span>.
					</p>
				</div>

				{/* Right: owed / owe boxes */}
				<div className="flex gap-3 shrink-0">
					<div className="bg-teal-50 rounded-xl px-5 py-4 border border-teal-100/80 min-w-30">
						<p className="text-[10px] font-semibold text-teal-500 uppercase tracking-wider mb-1.5">
							You are owed
						</p>
						<p className="text-xl font-bold text-teal-600">
							${formatAmount(posBalance)}
						</p>
					</div>
					<div className="bg-orange-50 rounded-xl px-5 py-4 border border-orange-100/80 min-w-30">
						<p className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider mb-1.5">
							You owe
						</p>
						<p className="text-xl font-bold text-orange-500">
							${formatAmount(negBalance)}
						</p>
					</div>
				</div>
			</div>

			{/* ── Footer ── */}
			<div className="pt-4 border-t border-slate-100 flex items-center justify-between">

				<div className="flex items-center -space-x-2">
					{memberNames.map((name, i) => (
						<div
							key={name}
							className={`w-7 h-7 rounded-full ring-2 ring-white flex items-center justify-center text-[10px] font-bold ${avatarColors[i % avatarColors.length]}`}
							style={{ zIndex: 10 - i }}
						>
							{name.charAt(0).toUpperCase()}
						</div>
					))}
					{membersCount > memberNames.length && (
						<div className="w-7 h-7 rounded-full ring-2 ring-white bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold" style={{ zIndex: 0 }}>
							+{membersCount - memberNames.length}
						</div>
					)}
					{membersCount === 0 && (
						<span className="text-xs text-slate-400">No recent interactions</span>
					)}
				</div>

				<Link
					to="/balance"
					className="flex items-center gap-1 text-sm font-semibold text-teal-500 hover:text-teal-600 transition-colors"
				>
					View details
					<ArrowRightIcon className="w-3.5 h-3.5" />
				</Link>
			</div>

		</Card>
	);
};

export default TotalBalanceCard;

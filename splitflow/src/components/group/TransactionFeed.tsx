import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import TransactionItem from "./TransactionItem";
import type { TransactionGroup } from "../../types/Transaction";
import Card from "../ui/Card";

interface Props {
	groups: TransactionGroup[];
}

const TransactionFeed = ({ groups }: Props) => {
	return (
		<div className="flex flex-col h-full w-full">

			{/* --- HEADER --- */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
				<h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>

				<div className="flex items-center gap-2">
					{/* Search Bar */}
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
						</div>
						<input
							type="text"
							placeholder="Search expenses"
							className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none w-full sm:w-64 transition-all"
						/>
					</div>

					{/* Filter Button */}
					<button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
						<FunnelIcon className="w-4 h-4" />
						<span className="hidden sm:inline">Filter</span>
					</button>
				</div>
			</div>

			{/* --- FEED LIST --- */}
			<Card className="p-0 overflow-hidden">
				<div className="flex flex-col divide-y divide-slate-100">
					{groups.map((group, groupIdx) => (
						<div key={groupIdx} className="flex flex-col">

							{/* Date Header Segment */}
							<div className="flex justify-between items-center px-4 sm:px-6 py-2 bg-slate-50/50 border-b border-slate-100">
								<h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
									{group.dateLabel}
								</h3>
								<span className="text-[10px] font-bold text-accent">
									Total: ${group.dailyTotal.toFixed(2)}
								</span>
							</div>

							{/* Transactions under this date */}
							<div className="flex flex-col divide-y divide-slate-100">
								{group.transactions.map((tx) => (
									<TransactionItem key={tx.id} tx={tx} />
								))}
							</div>

						</div>
					))}
				</div>

			</Card>
			<div className="border-t border-slate-100">
				<button className="w-full text-center py-4 text-xs font-bold text-teal-500 hover:text-teal-600 hover:bg-teal-50/30 transition-colors uppercase tracking-wider">
					View older activity
				</button>
			</div>
		</div>
	);
};

export default TransactionFeed;

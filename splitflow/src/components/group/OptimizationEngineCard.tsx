import type { DebtSettlement } from '../../types/Debt';
import { CheckBadgeIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface Props {
	settlements: DebtSettlement[];
}

const getInitials = (name: string) =>
	name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const OptimizationEngineCard = ({ settlements }: Props) => {
	const youOweCount  = settlements.filter(s => s.type === 'you-owe').length;
	const owesYouCount = settlements.filter(s => s.type === 'owes-you').length;

	if (settlements.length === 0) {
		return (
			<div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-center">
				<div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
					<CheckBadgeIcon className="w-6 h-6 text-teal-500" />
				</div>
				<h3 className="font-bold text-slate-900">All Settled Up!</h3>
				<p className="text-sm text-slate-400 mt-1">No pending debts in this group.</p>
			</div>
		);
	}

	return (
		<div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">

			{/* Header */}
			<div className="flex items-center gap-2 mb-1">
				<div className="p-1.5 bg-indigo-50 rounded-lg">
					<SparklesIcon className="w-4 h-4 text-indigo-500" />
				</div>
				<h2 className="text-base font-bold text-slate-900">Optimization Engine</h2>
			</div>

			<p className="text-xs text-slate-400 mb-4">
				Debts simplified to minimize total transfers.
			</p>

			{/* Summary pills */}
			<div className="flex gap-2 mb-5">
				{youOweCount > 0 && (
					<span className="text-[11px] font-semibold bg-orange-50 text-orange-500 px-2.5 py-1 rounded-full">
						{youOweCount} you owe
					</span>
				)}
				{owesYouCount > 0 && (
					<span className="text-[11px] font-semibold bg-teal-50 text-teal-500 px-2.5 py-1 rounded-full">
						{owesYouCount} owed to you
					</span>
				)}
			</div>

			{/* Settlement rows */}
			<div className="space-y-2.5">
				{settlements.map((item) => {
					const isYouOwe = item.type === 'you-owe';
					const otherName = isYouOwe ? item.creditorName : item.debtorName;

					return (
						<div
							key={item.id}
							className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors"
						>
							{/* Avatar */}
							<div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
								isYouOwe ? 'bg-orange-100 text-orange-600' : 'bg-teal-100 text-teal-600'
							}`}>
								{getInitials(otherName)}
							</div>

							{/* Name + amount */}
							<div className="flex-1 min-w-0">
								<p className="text-sm font-semibold text-slate-800 truncate">{otherName}</p>
								<p className={`text-xs font-bold ${isYouOwe ? 'text-orange-500' : 'text-teal-500'}`}>
									${item.amount.toFixed(2)}
								</p>
							</div>

							{/* Action button */}
							<button
								onClick={() => console.log(`Action for ${item.id}`)}
								className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
									isYouOwe
										? 'bg-orange-500 hover:bg-orange-600 text-white'
										: 'bg-white hover:bg-teal-50 text-teal-600 border border-teal-200'
								}`}
							>
								{isYouOwe ? 'Pay' : 'Remind'}
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default OptimizationEngineCard;

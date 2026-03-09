import type { DebtSettlement } from '../../types/Debt';
import { CheckBadgeIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

interface Props {
	settlements: DebtSettlement[];
}

const OptimizationEngineCard = ({ settlements }: Props) => {
	if (settlements.length === 0) {
		return (
			<div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-center">
				<div className="w-12 h-12 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
					<CheckBadgeIcon className="w-6 h-6" />
				</div>
				<h3 className="font-bold text-slate-900">All Settled Up!</h3>
				<p className="text-sm text-slate-500 mt-1">No pending debts in this group.</p>
			</div>
		);
	}

	return (
		<div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
			{/* Header */}
			<div className="flex items-center gap-2 mb-6">
				<div className="p-1.5 bg-indigo-50 text-indigo-500 rounded-lg">
					<SparklesIcon className="w-4 h-4" />
				</div>
				<h2 className="text-lg font-bold text-slate-900">Optimization Engine</h2>
			</div>

			<p className="sm:text-left text-xs text-slate-500 mb-6 border-b border-slate-100 pb-4">
				We've simplified the debts to minimize total transfers. Here is the easiest way to settle up.
			</p>

			{/* List of Actions */}
			<div className="space-y-4">
				{settlements.map((item) => {
					const isYouOwe = item.type === 'you-owe';

					return (
						<div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-colors">

							<div className="flex items-center gap-3">
								{/* Target Avatar */}
								{item.targetAvatar ? (
									<img src={item.targetAvatar} alt="avatar" className="xl:hidden w-10 h-10 rounded-full object-cover shadow-sm" />
								) : (
									<div className="xl:hidden w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
										{(isYouOwe ? item.creditorName : item.debtorName).substring(0, 2).toUpperCase()}
									</div>
								)}

								{/* Text Details */}
								<div>
									<p className="sm:text-left text-sm font-medium text-slate-600">
										{isYouOwe ? (
											<>You owe <span className="font-bold text-slate-900">{item.creditorName}</span></>
										) : (
											<><span className="font-bold text-slate-900">{item.debtorName}</span> owes you</>
										)}
									</p>
									<p className={`sm:text-left text-sm font-bold mt-0.5 ${isYouOwe ? 'text-orange-500' : 'text-teal-500'}`}>
										${item.amount.toFixed(2)}
									</p>
								</div>
							</div>

							{/* Action Button */}
							<Button
								variant={isYouOwe ? 'primary' : 'outline'}
								className="py-2 px-4 text-xs"
								onClick={() => console.log(`Action for ${item.id}`)}
							>
								{isYouOwe ? 'Pay Now' : 'Remind'}
							</Button>

						</div>
					);
				})}
			</div>
		</div>
	);
};

export default OptimizationEngineCard;


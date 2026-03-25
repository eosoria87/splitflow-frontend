import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

interface Props {
	balance: number;
}

const GroupBalanceCard = ({ balance }: Props) => {
	const isSettled = balance === 0;
	const isOwed    = balance > 0;
	const displayAmount = Math.abs(balance).toFixed(2);

	if (isSettled) {
		return (
			<div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center gap-4">
				<div className="w-11 h-11 bg-teal-50 rounded-2xl flex items-center justify-center shrink-0">
					<CheckBadgeIcon className="w-6 h-6 text-teal-500" />
				</div>
				<div className="text-left">
					<p className="text-sm font-bold text-slate-900">All settled up</p>
					<p className="text-xs text-slate-400 mt-0.5">No pending balance in this group.</p>
				</div>
			</div>
		);
	}

	return (
		<div className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-sm ${isOwed ? 'bg-primary' : 'bg-orange-500'}`}>

			{/* Decorative blobs */}
			<div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
			<div className="absolute -bottom-8 -left-4 w-24 h-24 bg-black/10 rounded-full blur-2xl pointer-events-none" />

			<div className="relative z-10">

				{/* Status badge */}
				<div className="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 mb-4">
					{isOwed
						? <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
						: <ArrowTrendingDownIcon className="w-3.5 h-3.5" />
					}
					<span className="text-[11px] font-bold uppercase tracking-wider">
						{isOwed ? 'You are owed' : 'You owe'}
					</span>
				</div>

				{/* Amount */}
				<p className="text-4xl font-bold tracking-tight">
					{isOwed ? '+' : '-'}${displayAmount}
				</p>

				{/* Subtitle */}
				<p className="text-sm text-white mt-3">
					{isOwed
						? 'The group owes you this amount.'
						: 'You owe the group this amount.'}
				</p>

			</div>
		</div>
	);
};

export default GroupBalanceCard;

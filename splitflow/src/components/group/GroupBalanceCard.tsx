interface Props {
	balance: number;
}

const GroupBalanceCard = ({ balance }: Props) => {
	const isOwed = balance >= 0;
	const displayAmount = Math.abs(balance).toFixed(2);

	return (
		<div className={`relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl transition-all ${isOwed
				? 'bg-primary'
				: 'bg-[#ef4444]'
			}`}>

			{/* Decorative background glows */}
			<div className="absolute bottom-0 right-0 -mb-8 -ml-8 w-32 h-32 bg-black opacity-10 rounded-full blur-2xl pointer-events-none"></div>

			<div className="relative z-10 divide-y divide-secondary/50">
				{/* Header */}
				<div>
					<p className="text-sm sm:text-left font-medium opacity-90 mb-1 tracking-wide">
						{isOwed ? 'You are owed' : 'You owe the group'}
					</p>

					{/* Huge Balance Number */}
					<h2 className="text-4xl sm:text-left md:text-5xl font-medium tracking-tight mb-8">
						{isOwed ? '+' : '-'}${displayAmount}
					</h2>
				</div>
				<div className="flex items-center justify-between py-2">
	
					<p className=" text-white/50 text-md">You are owed in total. Good job traking!</p>
				</div>
			</div>
		</div>
	);
};

export default GroupBalanceCard;

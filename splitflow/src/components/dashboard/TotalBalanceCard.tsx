import Card from "../ui/Card";

interface Props {
	totalBalance: number;
	posBalance: number;
	negBalance: number;
}

const TotalBalanceCard =  ({ totalBalance = 0, posBalance = 0, negBalance = 0 }: Props) => {

	return (
		<Card className="p-8">
			<div className="flex flex-col md:flex-row justify-between items-start gap-6">

				<div>
					<h2 className="text-xs text-left font-medium text-slate-400 tracking-wider uppercase mb-1">
					Total Balance
					</h2>

					<div className="flex items-center gap-3">
						<span className="text-4xl md:text-5xl font-bold text-slate-900">
						{totalBalance < 0 ? '-' : '+'}$ {totalBalance}
						</span>
						{/* The Percentage Badge */}
						<span className="bg-teal-50 text-teal-600 text-xs font-bold px-2.5 py-1 rounded-full">
							+0% this month
						</span>
					</div>

					 
					<p className="text-sm text-slate-500 mt-2 font-light text-left">
					You are overall in the {posBalance < negBalance ? "red" : "green"}.
					</p>
				</div>

				<div className="flex items-center gap-3 w-full md:w-auto">

					{/* You are Owed Box */}
					<div className="bg-teal-50/50 rounded-2xl px-5 py-4 flex-1 md:flex-initial border border-teal-100/50">
						<p className="text-[10px] sm:text-xs sm:font-medium text-teal-600/80 uppercase tracking-wide mb-1 sm:text-left">
							You are owed
						</p>
						<p className="text-xl font-extrabold text-teal-600 sm:text-left">
							${posBalance}
						</p>
					</div>

					{/* You Owe Box */}
					<div className="bg-orange-50/50 rounded-2xl px-5 py-4 flex-1 md:flex-initial border border-orange-100/50">
						<p className="text-[10px] sm:text-xs sm:font-medium text-orange-600/80 uppercase tracking-wide mb-1 sm:text-left">
							You owe
						</p>
						<p className="text-xl font-extrabold text-orange-600 sm:text-left">
							${negBalance}
						</p>
					</div>
				</div>
			</div>

			{/* --- BOTTOM SECTION --- */}
			<div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">

				{/* Avatar Group (The overlapping circles) */}
				{/* -space-x-3 forces the children to negatively overlap each other! */}
				<div className="flex items-center -space-x-3">
					{/* Mock Avatars - In a real app, you'd map over an array of user image URLs */}
					<div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 shadow-sm z-30"></div>
					<div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 shadow-sm z-20"></div>
					<div className="w-8 h-8 rounded-full border-2 border-white bg-teal-100 shadow-sm z-10"></div>

					{/* The "+4" Counter Badge */}
					<div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm z-0 relative left-1">
						+4
					</div>
				</div>

				{/* Action Link */}
				<button className="text-sm font-regular text-teal-500 hover:text-teal-600 transition-colors flex items-center gap-1">
          View details
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </button>

			</div>
		</Card>
	);
};

export default TotalBalanceCard;


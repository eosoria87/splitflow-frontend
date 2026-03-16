import Card from "../ui/Card";
import { Link } from "react-router-dom";

interface Props {
	totalBalance: number;
	posBalance: number;
	negBalance: number;
	membersCount: number;
	// In a real app, an array of member objects here
	memberNames: string[];
	monthlyChange?: number | null;

}

const TotalBalanceCard = ({ totalBalance, posBalance, negBalance, membersCount, memberNames, monthlyChange = null }: Props) => {


	const avatarColors = [
		"bg-slate-800 text-white",
		"bg-teal-100 text-teal-700",
		"bg-orange-100 text-orange-700"
	];

	let badgeColor = "bg-slate-100 text-slate-500"; // Neutral for "New"
	let badgeText = "New this month";

	if (monthlyChange !== null) {
		if (monthlyChange > 0) {
			badgeColor = "bg-teal-50 text-teal-600";
			badgeText = `+${monthlyChange.toFixed(0)}% this month`;
		} else if (monthlyChange < 0) {
			badgeColor = "bg-red-50 text-red-600";
			badgeText = `${monthlyChange.toFixed(0)}% this month`;
		} else {
			badgeColor = "bg-slate-100 text-slate-500";
			badgeText = "No change";
		}
	}

	return (
		<Card className="p-8">
			<div className="flex flex-col md:flex-row justify-between items-start gap-6">

				<div>
					<h2 className="text-xs text-left font-medium text-slate-400 tracking-wider uppercase mb-1">
						Total Balance
					</h2>

					<div className="flex items-center gap-3">
						<span className="text-4xl md:text-5xl font-bold text-slate-900">
							{totalBalance < 0 ? '-' : '+'}$ {Math.abs(totalBalance)}
						</span>
						{/* The Percentage Badge */}
						<span className={`${badgeColor} text-xs font-bold px-2.5 py-1 rounded-full`}>
							{badgeText}
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
				<div className="flex items-center -space-x-3">

					{/* Loop through the passed in names to generate initials */}
					{memberNames.map((name, index) => (
						<div
							key={name}
							className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-sm relative ${avatarColors[index % avatarColors.length]}`}
							style={{ zIndex: 30 - index }}
						>
							{name.charAt(0).toUpperCase()}
						</div>
					))}

					{/* The "+X" Counter Badge */}
					{/* Only show this if there are more people than the 3 we rendered */}
					{membersCount > memberNames.length && (
						<div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm z-0 relative left-1">
							+{membersCount - memberNames.length}
						</div>
					)}

					{/* Empty State: If no one is in the recent activity yet */}
					{membersCount === 0 && (
						<span className="text-xs text-slate-400 font-medium ml-2">No recent interactions</span>
					)}
				</div>

				{/* Action Link */}
				<Link
					to="/balance"
					className="text-sm font-medium text-teal-500 hover:text-teal-600 transition-colors flex items-center gap-1"
				>
					View details
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
						<path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
					</svg>
				</Link>

			</div>
		</Card>
	);
};

export default TotalBalanceCard;


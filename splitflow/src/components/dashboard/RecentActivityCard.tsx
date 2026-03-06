import Card from "../ui/Card";
import ActivityItem from "./ActivityItem";
import { Bars3BottomRightIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const RecentActivityCard = () => {
	return (
		// We add flex-col and h-full so the card stretches to match the height of the left column if needed
		<div className="flex flex-col h-full">

			{/* Header Row */}
			<div className="flex justify-between items-center mt-8 mb-4 lg:mt-0 lg:mb-4">
				<h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
				<button className="text-slate-400 hover:text-slate-600 transition-colors p-1">
					<Bars3BottomRightIcon className="w-5 h-5" />
				</button>
			</div>

			{/* Main Card Container */}
			{/* The overflow-hidden ensures the hover effects on the items don't bleed outside the rounded corners */}
			<Card className="flex flex-col flex-1 p-0 overflow-hidden">

				{/* THE MAGIC TRICK: divide-y and divide-slate-100 automatically puts borders BETWEEN the children! */}
				<div className="flex flex-col divide-y divide-slate-100">

					<ActivityItem
						// Passing a mock image for the avatar
						avatar={<img src="https://i.pravatar.cc/150?img=5" alt="Sarah" className="w-full h-full object-cover" />}
						personName="Sarah"
						action="added"
						target="Grocery Run"
						time="2h ago"
						statusText="You owe $24.50"
						statusColor="orange"
					/>

					<ActivityItem
						// Passing an SVG icon with a colored background instead of an image
						avatar={<div className="w-full h-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><BanknotesIcon className="w-5 h-5" /></div>}
						personName="Mike"
						action="paid"
						target="you"
						time="5h ago"
						statusText="+$45.00 received"
						statusColor="green"
					/>

					<ActivityItem
						avatar={<img src="https://i.pravatar.cc/150?img=11" alt="Tom" className="w-full h-full object-cover" />}
						personName="Tom"
						action="added"
						target="Dinner at Mario's"
						time="1d ago"
						statusText="You lent $15.00"
						statusColor="teal"
					/>

					<ActivityItem
						avatar={<img src="https://i.pravatar.cc/150?img=47" alt="You" className="w-full h-full object-cover" />}
						personName="You"
						action="updated"
						target="Wifi Bill"
						time="2d ago"
						statusText="No balance change"
						statusColor="slate"
					/>

				</div>

				<div className="mt-auto border-t border-slate-100">
					<Link
						to="/activity"
						className="block w-full text-center py-4 text-xs font-medium text-teal-500 hover:text-teal-600 hover:bg-teal-50/30 transition-colors uppercase tracking-wider"
					>
						View Full Activity
					</Link>
				</div>

			</Card>
		</div>
	);
};

export default RecentActivityCard;

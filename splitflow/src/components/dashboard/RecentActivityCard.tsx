import type { DashboardActivity } from "../../services/dashboardService";
import Card from "../ui/Card";
import ActivityItem  from "./ActivityItem";
import { Bars3BottomRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface Props {
	activity: DashboardActivity[];
}

const RecentActivityCard = ({ activity }: Props) => {
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

					{activity.map((item) => (
						<ActivityItem
							key={item.key}
							personName={item.personName}
							action={item.action}
							target={item.target}
							time={item.time}
							statusText={item.statusText}
							statusColor={item.statusColor}
							avatar={
            <div className="w-full h-full bg-accent text-white flex items-center justify-center text-lg font-bold">
                {item.personName.charAt(0).toUpperCase()}
            </div>
        }
						/>
					))}

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

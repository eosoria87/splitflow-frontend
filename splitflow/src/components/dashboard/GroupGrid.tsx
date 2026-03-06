import { HomeIcon } from '@heroicons/react/24/solid';
import CreateGroupCard from './CreateGroupCard';
import GroupCard from './GroupCard';
import { Link } from 'react-router-dom';


const GroupGrid = () => {
	return (
		<>
			<div className="flex justify-between items-center">
				<h2 className="text-lg font-bold text-slate-900">
					Your Groups
				</h2>
				<Link
					to="/groups"
					className="text-sm font-medium text-teal-500 hover:text-teal-600 transition-colors"
				>
					See all
				</Link>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

				<GroupCard
					title="Trip to Cabo"
					lastActivity="2 days ago"
					// Passing a placeholder SVG icon, you can use Heroicons here!
					icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>}
					iconBgClass="bg-blue-50 text-blue-500"
					status="owed"
					amount="$120.00"
				/>

				<GroupCard
					title="House Rent"
					lastActivity="Yesterday"
					icon={<HomeIcon />}
					iconBgClass="bg-indigo-50 text-indigo-500"
					status="owe"
					amount="$55.00"
				/>

				<GroupCard
					title="Pizza Night"
					lastActivity="5 days ago"
					icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
					iconBgClass="bg-yellow-50 text-yellow-500"
					status="settled"
				/>

				<CreateGroupCard />

			</div>
		</>
	);
};

export default GroupGrid;


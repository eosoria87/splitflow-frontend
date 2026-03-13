import CreateGroupCard from './CreateGroupCard';
import GroupCard  from './GroupCard';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    PaperAirplaneIcon, 
    HomeIcon, 
    HeartIcon, 
    UsersIcon, 
    TagIcon 
} from '@heroicons/react/24/solid';
import type { DashboardGroup } from '../../services/dashboardService';

interface Props {
	groups: DashboardGroup[];
}

const getCategoryStyles = (category: string) => {
    switch (category.toLowerCase()) {
        case 'trip': case 'travel': return 'bg-blue-50 text-blue-500';
        case 'home': return 'bg-indigo-50 text-indigo-500';
        case 'couple': return 'bg-pink-50 text-pink-500';
        case 'friends': return 'bg-yellow-50 text-yellow-500';
        case 'other': 
        default: return 'bg-slate-100 text-slate-500'; 
    }
};

const getCategoryIcon = (category: string) => {
    const className = "w-5 h-5";
    switch (category.toLowerCase()) {
        case 'trip': case 'travel': return <PaperAirplaneIcon className={className} />;
        case 'home': return <HomeIcon className={className} />;
        case 'couple': return <HeartIcon className={className} />;
        case 'friends': return <UsersIcon className={className} />;
        case 'other':
        default: return <TagIcon className={className} />;
    }
};

const GroupGrid = ( { groups } : Props  ) => {

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

				{groups.map((group) => (
					<GroupCard
						key={group.id}
						title={group.name}
						lastActivity={group.updatedAt}
						status={group.status}
						amount={group.amount || undefined}
						iconBgClass={getCategoryStyles(group.category)}
						icon={getCategoryIcon(group.category)}
					/>
				))}

				<CreateGroupCard handleClick={() => toast.success("Create new group clicked", {position: "bottom-center",autoClose: 3000,})} />

			</div>
		</>
	);
};

export default GroupGrid;


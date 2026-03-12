import CreateGroupCard from './CreateGroupCard';
import GroupCard, { type GroupCardType } from './GroupCard';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    PaperAirplaneIcon, 
    HomeIcon, 
    HeartIcon, 
    UsersIcon, 
    TagIcon 
} from '@heroicons/react/24/solid';


interface Props {
	groups: GroupCardType[];
}

const getCategoryIcon = (category?: string) => {
    const className = "w-5 h-5"; // Standardizing the size
    
    switch (category?.toLowerCase()) {
        case 'trip': return <PaperAirplaneIcon className={className} />;
        case 'travel': return <PaperAirplaneIcon className={className} />;
        case 'home': return <HomeIcon className={className} />;
        case 'couple': return <HeartIcon className={className} />;
        case 'friends': return <UsersIcon className={className} />;
        case 'other':
        default: 
            return <TagIcon className={className} />;
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
						key={group.key}
						name={group.name}
						updated_at={group.updated_at}
						iconBgClass={group.iconBgClass}
						status={group.status}
						amount={group.amount || undefined}
						icon={getCategoryIcon(group.category)}
					/>
				))}

				<CreateGroupCard handleClick={() => toast.success("Create new group clicked", {position: "bottom-center",autoClose: 3000,})} />

			</div>
		</>
	);
};

export default GroupGrid;


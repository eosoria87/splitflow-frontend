import CreateGroupCard from './CreateGroupCard';
import GroupCard from './GroupCard';
import { Link } from 'react-router-dom';
import type { GroupCardType } from '../../types/Group';


interface Props {
	groups: GroupCardType[];
}

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
						updated_at={(group.updated_at || new Date()).toString()}
						status={group.status}
						amount={group.amount}
					/>
				))}

				<CreateGroupCard handleClick={() => console.log("Create new group clicked")} />

			</div>
		</>
	);
};

export default GroupGrid;


import { Link } from 'react-router-dom';
import CreateGroupCard from './CreateGroupCard';
import GroupCard from './GroupCard';
import type { DashboardGroup } from '../../services/dashboardService';
import { groupCategoryConfig } from '../../constants/transactionCategories';

interface Props {
  groups: DashboardGroup[];
}

const GroupGrid = ({ groups }: Props) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900">Your Groups</h2>
        <Link to="/groups" className="text-sm font-medium text-teal-500 hover:text-teal-600 transition-colors">
          See all
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {groups.map((group) => {
          const config = groupCategoryConfig[group.category as keyof typeof groupCategoryConfig] ?? groupCategoryConfig.other;
          const Icon = config.icon;
          return (
            <GroupCard
              key={group.id}
              id={group.id}
              title={group.name}
              lastActivity={group.updatedAt}
              icon={<Icon className="w-5 h-5" />}
              iconBgClass={config.color}
              status={group.status}
            />
          );
        })}
        <CreateGroupCard />
      </div>
    </>
  );
};

export default GroupGrid;

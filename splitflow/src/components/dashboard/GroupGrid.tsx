import { Link } from 'react-router-dom';
import {
  PaperAirplaneIcon,
  HomeIcon,
  HeartIcon,
  UserGroupIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import CreateGroupCard from './CreateGroupCard';
import GroupCard from './GroupCard';
import type { DashboardGroup } from '../../services/dashboardService';

// Maps backend category values to icon + colour
const categoryMeta: Record<string, { icon: React.ReactNode; iconBgClass: string }> = {
  travel:  { icon: <PaperAirplaneIcon className="w-5 h-5" />, iconBgClass: 'bg-blue-50 text-blue-500' },
  home:    { icon: <HomeIcon className="w-5 h-5" />,          iconBgClass: 'bg-indigo-50 text-indigo-500' },
  couple:  { icon: <HeartIcon className="w-5 h-5" />,         iconBgClass: 'bg-pink-50 text-pink-500' },
  friends: { icon: <UserGroupIcon className="w-5 h-5" />,     iconBgClass: 'bg-teal-50 text-teal-500' },
  other:   { icon: <Squares2X2Icon className="w-5 h-5" />,    iconBgClass: 'bg-slate-100 text-slate-500' },
};

const fallbackMeta = { icon: <Squares2X2Icon className="w-5 h-5" />, iconBgClass: 'bg-slate-100 text-slate-500' };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => {
          const meta = categoryMeta[group.category] ?? fallbackMeta;
          return (
            <GroupCard
              key={group.id}
              id={group.id}
              title={group.name}
              lastActivity={group.updatedAt}
              icon={meta.icon}
              iconBgClass={meta.iconBgClass}
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

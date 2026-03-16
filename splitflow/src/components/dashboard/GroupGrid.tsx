import { useEffect, useState } from 'react';
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
import groupService, { type Group } from '../../services/groupService';
import { useAuth } from '../../hooks/useAuth';

// Maps backend category values to icon + colour
const categoryMeta: Record<string, { icon: React.ReactNode; iconBgClass: string }> = {
  travel:        { icon: <PaperAirplaneIcon className="w-5 h-5" />, iconBgClass: 'bg-blue-50 text-blue-500' },
  home:          { icon: <HomeIcon className="w-5 h-5" />,          iconBgClass: 'bg-indigo-50 text-indigo-500' },
  couple:        { icon: <HeartIcon className="w-5 h-5" />,         iconBgClass: 'bg-pink-50 text-pink-500' },
  friends:       { icon: <UserGroupIcon className="w-5 h-5" />,     iconBgClass: 'bg-teal-50 text-teal-500' },
  other:         { icon: <Squares2X2Icon className="w-5 h-5" />,    iconBgClass: 'bg-slate-100 text-slate-500' },
};

const fallbackMeta = { icon: <Squares2X2Icon className="w-5 h-5" />, iconBgClass: 'bg-slate-100 text-slate-500' };

const formatRelativeTime = (isoDate: string): string => {
  const diff = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
};

const Skeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl border border-slate-100 p-5 h-40 flex flex-col gap-3">
    <div className="flex justify-between">
      <div className="w-10 h-10 rounded-xl bg-slate-100" />
      <div className="w-20 h-6 rounded-full bg-slate-100" />
    </div>
    <div className="w-32 h-4 rounded bg-slate-100" />
    <div className="w-24 h-3 rounded bg-slate-100" />
  </div>
);

const GroupGrid = () => {
  const { session } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.access_token) return;
    groupService.getGroups(session.access_token)
      .then(setGroups)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [session?.access_token]);

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900">Your Groups</h2>
        <Link to="/groups" className="text-sm font-medium text-teal-500 hover:text-teal-600 transition-colors">
          See all
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          <>
            {groups.map((group) => {
              const meta = categoryMeta[group.category ?? ''] ?? fallbackMeta;
              return (
                <GroupCard
                  key={group.id}
                  title={group.name}
                  lastActivity={formatRelativeTime(group.created_at)}
                  icon={meta.icon}
                  iconBgClass={meta.iconBgClass}
                  status="settled"
                />
              );
            })}
            <CreateGroupCard />
          </>
        )}
      </div>
    </>
  );
};

export default GroupGrid;

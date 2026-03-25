import { Link } from 'react-router-dom';
import CreateGroupCard from './CreateGroupCard';
import GroupCard from './GroupCard';
import type { DashboardGroup } from '../../services/dashboardService';
import { groupCategoryConfig } from '../../constants/transactionCategories';
import { loadGroupCache } from '../../services/groupCacheService';

interface Props {
	groups: DashboardGroup[];
	isLoading?: boolean;
}

const GroupGrid = ({ groups, isLoading = false }: Props) => {
	return (
		<>
			<div className="flex justify-between items-center">
				<h2 className="text-lg font-bold text-slate-900">Your Groups</h2>
				<Link to="/groups" className="text-sm font-medium text-teal-500 hover:text-teal-600 transition-colors">
					See all
				</Link>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-2 gap-4">
				{isLoading ? (
					// 🌟 RENDER SKELETON CARDS 🌟
					// Rendering 3 skeletons keeps the grid looking full when paired with the Create button
					Array.from({ length: 3 }).map((_, index) => (
						<div
							key={index}
							className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between min-h-37.5"
						>
							<div className="flex justify-between items-start mb-4">
								{/* Icon Skeleton */}
								<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-200 animate-pulse" />
								{/* Status Badge Skeleton */}
								<div className="w-14 h-5 rounded-full bg-slate-100 animate-pulse" />
							</div>
							<div className="space-y-2 mt-auto">
								{/* Title Skeleton */}
								<div className="h-4 bg-slate-200 animate-pulse rounded w-3/4" />
								{/* Subtitle/Activity Skeleton */}
								<div className="h-3 bg-slate-100 animate-pulse rounded w-1/2" />
							</div>
						</div>
					))
				) : (
					// 🌟 RENDER REAL DATA CARDS 🌟
					groups.map((group) => {
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
								amount={group.amount}
								memberNames={loadGroupCache(group.id)?.memberNames ?? []}
							/>
						);
					})
				)}
				<CreateGroupCard />
			</div>
		</>
	);
};

export default GroupGrid;

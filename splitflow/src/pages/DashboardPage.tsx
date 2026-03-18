import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import TotalBalanceCard from "../components/dashboard/TotalBalanceCard";
import GroupGrid from "../components/dashboard/GroupGrid";
import RecentActivityCard from "../components/dashboard/RecentActivityCard";
import MainContainer from "../components/ui/MainContainer";
import { dashboardService, DASHBOARD_CACHE_KEY, type DashboardActivity, type DashboardGroup, type OverallBalances } from "../services/dashboardService";
import { prefetchGroup } from "../services/groupCacheService";
import { useAuth } from "../hooks/useAuth";

const CACHE_KEY = DASHBOARD_CACHE_KEY;

interface DashboardCache {
	balances: OverallBalances;
	userGroups: DashboardGroup[];
	recentActivity: DashboardActivity[];
}

const loadCache = (): DashboardCache | null => {
	try {
		const stored = sessionStorage.getItem(CACHE_KEY);
		return stored ? JSON.parse(stored) : null;
	} catch {
		return null;
	}
};

const DashboardPage = () => {

	const { user, isLoading } = useAuth();
	const cache = loadCache();

	const [balances, setBalances] = useState<OverallBalances>(
		cache?.balances ?? { totalBalance: 0, posBalance: 0, negBalance: 0, monthlyChange: null }
	);
	const [userGroups, setUserGroups] = useState<DashboardGroup[]>(cache?.userGroups ?? []);
	const [recentActivity, setRecentActivity] = useState<DashboardActivity[]>(cache?.recentActivity ?? []);

	useEffect(() => {
		const fetchDashboardData = async () => {
			if (!user) return;

			const groups = await dashboardService.getGroups();
			const groupExpensesMap = await dashboardService.getGroupExpenses(groups);
			const allExpenses = Object.values(groupExpensesMap).flat();

			// Pass already-fetched expenses so group prefetch only needs the detail call
			groups.forEach(g => prefetchGroup(g.id, user.id, groupExpensesMap[g.id]));

			const freshGroups = dashboardService.getUserGroups(groups, groupExpensesMap);
			const balanceData = dashboardService.getOverallBalances(user.id, groupExpensesMap);
			const activityData = dashboardService.getRecentActivity(user.id, allExpenses);

			setBalances(balanceData);
			setUserGroups(freshGroups);
			setRecentActivity(activityData);

			sessionStorage.setItem(CACHE_KEY, JSON.stringify({
				balances: balanceData,
				userGroups: freshGroups,
				recentActivity: activityData,
			}));
		};

		fetchDashboardData();

	}, [user]);

	const { recentMembersCount, recentMemberNames } = useMemo(() => {
		const allNames = recentActivity
			.map(act => act.personName)
			.filter(name => name !== 'You' && name !== 'Someone');

		const uniqueNames = Array.from(new Set(allNames));

		return {
			recentMembersCount: uniqueNames.length,
			recentMemberNames: uniqueNames.slice(0, 3)
		};
	}, [recentActivity]); // This automatically re-runs anytime recentActivity changes

	if (isLoading) {
		return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
	}

	if (!user) {
		return <div className="min-h-screen flex items-center justify-center">Please log in to view your dashboard.</div>;
	}


	return (
		<div className="min-h-screen flex">

			{/* --- Sidebar for desktop --- */}
			<Sidebar />

			<main className="flex-1  flex  flex-col min-h-screen">
				{/* --- HEADER --- */}
				<Header
					title='Dashboard'
					subtitle={`Welcome back ${user.name ? user.name.split(' ')[0] : ''}, let's settle up!`}
				/>

				{/* --- THE CORE GRID --- */}
				<div className="xl:pl-64  sm:px-8 pb-12  gap-8 ">
					<TotalBalanceCard
						totalBalance={balances.totalBalance}
						posBalance={balances.posBalance}
						negBalance={balances.negBalance}
						membersCount={recentMembersCount}
						memberNames={recentMemberNames}
						monthlyChange={balances.monthlyChange} 
					/>
				</div>

				<MainContainer columnsNum={3}>
					{/* --- Groups Grid --- */}
					<div className="xl:col-span-2 flex flex-col gap-4">
						<GroupGrid groups={userGroups} />
					</div>

					{/* --- Activity List --- */}
					<div className="xl:col-span-1">
						<RecentActivityCard activity={recentActivity} />
					</div>
				</MainContainer>

			</main>
		</div>
	);
};

export default DashboardPage;

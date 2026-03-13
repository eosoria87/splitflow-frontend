import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/navigation/Sidebar";
import Header from "../components/navigation/Header";
import TotalBalanceCard from "../components/dashboard/TotalBalanceCard";
import GroupGrid from "../components/dashboard/GroupGrid";
import RecentActivityCard from "../components/dashboard/RecentActivityCard";
import MainContainer from "../components/ui/MainContainer";
import { dashboardService, type DashboardActivity, type DashboardGroup } from "../services/dashboardService";
import { useAuth } from "../hooks/useAuth";


const DashboardPage = () => {

	const { user, isLoading } = useAuth();

	const [balances, setBalances] = useState({ 
		totalBalance: 0, posBalance: 0, negBalance: 0, monthlyChange: null as number | null
	});
	const [userGroups, setUserGroups] = useState<DashboardGroup[]>([]);
	const [recentActivity, setRecentActivity] = useState<DashboardActivity[]>([]);

	useEffect(() => {
		const fetchDashboardData = async () => {
			if (!user) return;

			const currentUserId = user.id;

			const balanceData = await dashboardService.getOverallBalances(currentUserId);
			if (balanceData) setBalances(balanceData);

			const groupsData = await dashboardService.getUserGroups();
			if (groupsData) setUserGroups(groupsData);

			const activityData = await dashboardService.getRecentActivity(currentUserId);
			if (activityData) setRecentActivity(activityData);
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

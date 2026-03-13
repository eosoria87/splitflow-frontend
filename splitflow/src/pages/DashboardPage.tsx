import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/navigation/Sidebar";
import Header from "../components/navigation/Header";
import TotalBalanceCard from "../components/dashboard/TotalBalanceCard";
import GroupGrid from "../components/dashboard/GroupGrid";
import RecentActivityCard from "../components/dashboard/RecentActivityCard";
import MainContainer from "../components/ui/MainContainer";
import { dashboardService, type DashboardActivity, type DashboardGroup } from "../services/dashboardService";



const DashboardPage = ( ) => {

	const [balances, setBalances] = useState({ totalBalance: 0, posBalance: 0, negBalance: 0 });
	const [ userGroups, setUserGroups] = useState<DashboardGroup[]>([]);
	const [ recentActivity, setRecentActivity] = useState<DashboardActivity[]>([]);

	useEffect(() => {
		const fetchDashboardData = async () => {
			const testUserId = "6e1f3369-7bcf-4f4a-8550-8b0220121d04";
			// const testUserId = "711fb5cd-fa08-46bb-995b-e7adedcb607d";
			//
			const balanceData = await dashboardService.getOverallBalances(testUserId);
			if (balanceData) setBalances(balanceData);

			const groupsData = await dashboardService.getUserGroups(testUserId);
			if (groupsData) setUserGroups(groupsData);

			const activityData = await dashboardService.getRecentActivity(testUserId);
			if (activityData) setRecentActivity(activityData);
		};

		fetchDashboardData();

	}, []);

	// --- NEW LOGIC: Extract unique members from recent activity ---
	const { recentMembersCount, recentMemberNames } = useMemo(() => {
		// 1. Get all names, filter out "You" and "Someone"
		const allNames = recentActivity
			.map(act => act.personName)
			.filter(name => name !== 'You' && name !== 'Someone');

		// 2. Remove duplicates using a Set
		const uniqueNames = Array.from(new Set(allNames));

		return {
			recentMembersCount: uniqueNames.length,
			// Grab just the first 3 names to display as bubbles
			recentMemberNames: uniqueNames.slice(0, 3)
		};
	}, [recentActivity]); // This automatically re-runs anytime recentActivity changes

	return (
		<div className="min-h-screen flex">

			{/* --- Sidebar for desktop --- */}
			<Sidebar />

<main className="flex-1  flex  flex-col min-h-screen">
				{/* --- HEADER --- */}
			<Header 
					title='Dashboard' 
					subtitle="Welcome back, let's settle up!" 
				/>
				{/* --- THE CORE GRID --- */}
				<div className="xl:pl-64  sm:px-8 pb-12  gap-8 ">
					<TotalBalanceCard 
						totalBalance={balances.totalBalance} 
						posBalance={balances.posBalance} 
						negBalance={balances.negBalance} 
						membersCount={recentMembersCount}
						memberNames={recentMemberNames}
					/>
				</div>
				<MainContainer columnsNum={3}>
				{/* --- Groups Grid --- */}
					<div className="xl:col-span-2 flex flex-col gap-4">
						<GroupGrid groups={userGroups}/>
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

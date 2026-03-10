import Sidebar from "../components/navigation/Sidebar";
import Header from "../components/navigation/Header";
import TotalBalanceCard from "../components/dashboard/TotalBalanceCard";
import GroupGrid from "../components/dashboard/GroupGrid";
import RecentActivityCard from "../components/dashboard/RecentActivityCard";
import MainContainer from "../components/ui/MainContainer";

const DashboardPage = () => {

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
						totalBalance={0} 
						posBalance={0} 
						negBalance={0} 
					/>
				</div>
				<MainContainer columnsNum={3}>
				{/* --- Groups Grid --- */}
					<div className="xl:col-span-2 flex flex-col gap-4">
						<GroupGrid />
					</div>
				{/* --- Activity List --- */}
					<div className="xl:col-span-1">
						<RecentActivityCard />
					</div>
				</MainContainer>

			</main>
		</div>
	);
};

export default DashboardPage;

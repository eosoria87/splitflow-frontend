import { PaperAirplaneIcon, CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";
import GroupBalanceCard from "../components/group/GroupBalanceCard";
import TransactionFeed from "../components/group/TransactionFeed";
import Header from "../components/navigation/Header";
import Sidebar from "../components/navigation/Sidebar";
import MainContainer from "../components/ui/MainContainer";
import OptimizationEngineCard from "../components/group/OptimizationEngineCard";
import { mockTransactionGroups } from "../data/mockTransactions";
import { mockSettlements } from "../data/mockSettlements";
import type { DebtSettlement } from "../types/Debt";



const GroupPage = () => {
	const settlements : DebtSettlement[] = [];
  return (
		<div className="min-h-screen flex">

			{/* --- Sidebar for desktop --- */}
			<Sidebar />

			<main className="flex-1  flex  flex-col min-h-screen">
				{/* --- HEADER --- */}
				<Header 
					title='EuroTrip 2025' 
					subtitle="Groups / Travel"
					icon={<PaperAirplaneIcon/>}
				>
					<div className="hidden xl:flex py-3 items-center">
					<CalendarIcon className="text-primary size-5"/>
						<p className="text-xs text-black ml-1">June 12 - June 24, 2025</p>
					<MapPinIcon className="text-primary size-5 ml-5"/>
						<p className="text-xs text-black ml-1">Paris, Amsterdam, Berlin</p>
					</div>
				</Header>
				{/* --- THE CORE GRID --- */}
				<MainContainer columnsNum={3}>
				{/* --- Groups Grid --- */}
					<div className="xl:col-span-2 flex flex-col gap-4">
					<TransactionFeed groups={mockTransactionGroups}/> 

					</div>
				{/* --- Activity List --- */}
					<div className="xl:col-span-1 space-y-6 lg:sticky lg:top-8">
					<GroupBalanceCard balance={20}/>

					<OptimizationEngineCard settlements={settlements} />

					</div>
				</MainContainer>

			</main>
		</div>
  );
};

export default GroupPage;


import { PaperAirplaneIcon  } from "@heroicons/react/24/outline";
import GroupBalanceCard from "../components/group/GroupBalanceCard";
import TransactionFeed from "../components/group/TransactionFeed";
import GroupDetailsBar from "../components/group/GroupDetailsBar";
import OptimizationEngineCard from "../components/group/OptimizationEngineCard";
import Header from "../components/navigation/Header";
import Sidebar from "../components/navigation/Sidebar";
import MainContainer from "../components/ui/MainContainer";
import { mockTransactionGroups } from "../data/mockTransactions";
import { mockSettlements } from "../data/mockSettlements";
import { mockAvatars } from "../data/mockAvatars";
import type { DebtSettlement } from "../types/Debt";



const GroupPage = () => {
	const settlements : DebtSettlement[] = []; {/*Empty array for debt settlements*/}
  return (
		<div className="min-h-screen flex">

			{/* --- Sidebar for desktop --- */}
			<Sidebar />

			<main className="flex-1  flex  flex-col min-h-screen ">
				{/* --- HEADER --- */}
					<Header
						title='EuroTrip 2025'
						subtitle="Date"
						icon={<PaperAirplaneIcon />}
					/>

					<GroupDetailsBar
						category="Travel"
            dateRange="June 12 - June 24, 2024"
            location="Paris, Amsterdam, Berlin"
            membersCount={6}
            memberAvatars={mockAvatars}
					/>
				{/* --- THE CORE GRID --- */}
				<MainContainer columnsNum={3}>
				{/* --- Groups Grid --- */}
					<div className="xl:col-span-2 flex flex-col gap-4">
					<TransactionFeed groups={mockTransactionGroups}/> 

					</div>
				{/* --- Activity List --- */}
					<div className="xl:col-span-1 space-y-6 lg:sticky lg:top-8">
					<GroupBalanceCard balance={20}/>

					<OptimizationEngineCard settlements={mockSettlements} />

					</div>
				</MainContainer>

			</main>
		</div>
  );
};

export default GroupPage;


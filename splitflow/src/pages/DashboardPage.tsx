import TotalBalanceCard from "../components/dashboard/TotalBalanceCard";
import GroupGrid from "../components/dashboard/GroupGrid";
import RecentActivityCard from "../components/dashboard/RecentActivityCard";
import Button from "../components/ui/Button"; // Assuming you have your Button component here
import { BellIcon, PlusIcon } from "@heroicons/react/24/outline";
import Sidebar from "../components/navigation/Sidebar";
import MobileMenu from "../components/navigation/MobileMenu";
import AddExpenseModal from "../components/ui/AddExpenseModal";
import { useState } from "react";

const DashboardPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div className="min-h-screen flex">

			<Sidebar />
			<AddExpenseModal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}} />

			<main className="flex-1  flex  flex-col min-h-screen">

				{/* --- TOP HEADER --- */}
				<header className="xl:pl-64 sm:px-4 sm:px-8 pb-8 flex flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<MobileMenu />
						<div>
							<h1 className="text-2xl font-bold mt-1 text-left text-slate-900">Dashboard</h1>
							<p className="text-sm  text-slate-500 hidden sm:block">Welcome back, let's settle up!</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm shrink-0">
							<BellIcon className="w-5 h-5" />
						</button>

						<Button variant="primary" onClick={() => setIsModalOpen(true)} className="py-2.5 px-4 sm:px-6 flex items-center gap-2 shrink-0">
							<PlusIcon className="w-4 h-4" />
							<span className="hidden sm:inline">Add Expense</span>
						</Button>
					</div>

				</header>

				{/* --- THE CORE GRID --- */}
				<div className="xl:pl-64 sm:px-4 sm:px-8 pb-12  gap-8 ">
					<TotalBalanceCard totalBalance={0} posBalance={0} negBalance={0} />
				</div>
				<div className="xl:pl-64 sm:px-4 sm:px-8 pb-12 grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

					<div className="xl:col-span-2 flex flex-col gap-4">
						<GroupGrid />
					</div>

					<div className="xl:col-span-1">
						<RecentActivityCard />
					</div>

				</div>

			</main>
		</div>
	);
};

export default DashboardPage;

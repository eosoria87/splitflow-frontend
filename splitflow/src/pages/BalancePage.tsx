import Sidebar from "../components/navigation/Sidebar";
import Header from "../components/navigation/Header";
import { useState } from "react";
import BalanceCard from "../components/balance/BalanceCard";
import MainContainer from "../components/ui/MainContainer";
import RecoveredProgress from "../components/balance/RecoveredProgress";


const BalancePage = () => {
	const [view, setView] = useState<'group' | 'person'>('group');


	return (
		<div className="min-h-screen flex">

			<Sidebar />

			<main className="flex-1  flex  flex-col min-h-screen">

				{/* --- TOP HEADER --- */}
				<Header title="" />

				{/* --- THE CORE GRID --- */}
				<div className="xl:pl-64 sm:px-8 pb-12  gap-8 ">
					{/* --- HERO SECTION --- */}
					<header className="text-center space-y-4">
						<p className="text-[10px] uppercase tracking-widest font-medium text-accent">Your Net Position</p>
						<h1 className="text-5xl md:text-6xl font-bold text-primary ">
							You are owed $145.00
						</h1>

						{/* Toggle Switch */}
						<div className="inline-flex bg-slate-200/50 p-1 rounded-xl border border-slate-200">
							<button
								onClick={() => setView('group')}
								className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'group' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
							>
								👥 By Group
							</button>
							<button
								onClick={() => setView('person')}
								className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'person' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
							>
								👤 By Person
							</button>
						</div>
					</header>
				</div>

				<MainContainer columnsNum={2}>

					{/* Owed to You - Column */}
					<section className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="flex items-center gap-2 font-bold text-slate-800">
								<span className="text-teal-500 font-black">↗</span> Owed to You
							</h3>
							<span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-xs font-bold">+$215.00</span>
						</div>
						<div className="space-y-4">
							<BalanceCard
								item={{ id: '1', name: 'Sarah Miller', description: 'Iceland Trip', amount: 50, type: 'owed-to-me', status: 'Due in 2 days', image: 'https://i.pravatar.cc/150?img=32' }}
								onAction={(id) => console.log('Reminding', id)}
							/>
							{/* Add more cards here */}
						</div>
					</section>
					{/* You Owe - Column */}
					<section className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="flex items-center gap-2 font-bold text-slate-800">
								<span className="text-red-500 font-black">↘</span> You Owe
							</h3>
							<span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">-$70.00</span>
						</div>
						<div className="space-y-4">
							<BalanceCard
								item={{ id: '2', name: 'Mike Ross', description: 'Apartment Utilities', amount: 20, type: 'i-owe', status: 'Overdue', image: 'https://i.pravatar.cc/150?img=12' }}
								onAction={(id) => console.log('Paying', id)}
							/>
						</div>
					</section>
					{/* --- INSIGHTS CARD --- */}
					<section className="bg-teal-50/50 border border-teal-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 xl:col-span-2">
						<div className="max-w-md space-y-4">
							<h3 className="text-2xl font-bold text-slate-900">Flow Insights</h3>
							<p className="text-slate-600 leading-relaxed">
								Your spending this month is <span className="text-teal-600 font-bold">12% lower</span> than last month.
								Most of your debts are from the <span className="font-bold">"Apartment Utilities"</span> group.
							</p>
							<div className="flex gap-4">
								<div className="bg-white p-4 rounded-2xl shadow-sm flex-1">
									<p className="text-[10px] uppercase font-bold text-slate-400">Monthly Spend</p>
									<p className="text-xl font-black text-slate-900">$1,240.00</p>
								</div>
								<div className="bg-white p-4 rounded-2xl shadow-sm flex-1">
									<p className="text-[10px] uppercase font-bold text-slate-400">Settled</p>
									<p className="text-xl font-black text-teal-500">85%</p>
								</div>
							</div>
						</div>

						{/* Simplified Circular Progress */}
						<RecoveredProgress percentage={75} />
					</section>

				</MainContainer>
			</main>
		</div>
	);
};

export default BalancePage;


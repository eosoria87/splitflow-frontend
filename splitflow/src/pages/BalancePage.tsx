import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { useEffect, useState } from "react";
import BalanceCard from "../components/ui/BalanceCard";
import MainContainer from "../components/ui/MainContainer";
import RecoveredProgress from "../components/ui/RecoveredProgress";
import { useAuth } from "../hooks/useAuth";
import type { BalanceItem } from "../types/BalanceItem";
import { PaperAirplaneIcon, HomeIcon, HeartIcon, UsersIcon, TagIcon } from "@heroicons/react/24/outline";
import { balanceService, type GroupBalanceData, type PersonBalanceData, type FlowInsights } from "../services/balanceService";


const BalancePage = () => {
	const { user, isLoading } = useAuth();
	const [view, setView] = useState<'group' | 'person'>('group');
	const [owedToMe, setOwedToMe] = useState<BalanceItem[]>([]);
	const [iOwe, setIOwe] = useState<BalanceItem[]>([]);
	const [totals, setTotals] = useState({ pos: 0, neg: 0, net: 0 });
	const [insights, setInsights] = useState<FlowInsights | null>(null);

	const [isFetchingBalances, setIsFetchingBalances] = useState(true);
	const [isFetchingInsights, setIsFetchingInsights] = useState(true);

	const getIconForCategory = (category: string) => {
		const className = "w-6 h-6";
		switch (category.toLowerCase()) {
			case 'trip': case 'travel': return <PaperAirplaneIcon className={className} />;
			case 'home': return <HomeIcon className={className} />;
			case 'couple': return <HeartIcon className={className} />;
			case 'friends': return <UsersIcon className={className} />;
			default: return <TagIcon className={className} />;
		}
	};

	useEffect(() => {
		const fetchInsights = async () => {
			if (!user) return;
			setIsFetchingInsights(true);
			try {
				const insightsData = await balanceService.getFlowInsights(user.id);
				setInsights(insightsData);
			} finally {
				setIsFetchingInsights(false);
			}
		};

		fetchInsights();
	}, [user]);

	useEffect(() => {
		const fetchBalances = async () => {
			if (!user) return;
			setIsFetchingBalances(true);

			try {
				if (view === 'group') {
					const data = await balanceService.getBalancesByGroup(user.id);
					const mapToUI = (item: GroupBalanceData): BalanceItem => ({
						id: item.id,
						name: item.name,
						description: `${item.category.charAt(0).toUpperCase() + item.category.slice(1)} Group`,
						amount: item.amount,
						type: item.type,
						status: 'Group Balance',
						icon: getIconForCategory(item.category)
					});

					setOwedToMe(data.owedToMe.map(mapToUI));
					setIOwe(data.iOwe.map(mapToUI));
					setTotals({ pos: data.totalOwedToMe, neg: data.totalIOwe, net: data.totalOwedToMe - data.totalIOwe });

				} else if (view === 'person') {
					const data = await balanceService.getBalancesByPerson(user.id);
					const mapToUI = (item: PersonBalanceData): BalanceItem => ({
						id: item.id,
						name: item.name,
						description: 'Aggregated Balance',
						amount: item.amount,
						type: item.type,
						status: 'Individual Balance',
						icon: (
							<div className="w-full h-full flex items-center justify-center font-bold text-lg bg-slate-800 text-white rounded-xl">
								{item.name.charAt(0).toUpperCase()}
							</div>
						)
					});

					setOwedToMe(data.owedToMe.map(mapToUI));
					setIOwe(data.iOwe.map(mapToUI));
					setTotals({ pos: data.totalOwedToMe, neg: data.totalIOwe, net: data.totalOwedToMe - data.totalIOwe });
				}
			} finally {
				setIsFetchingBalances(false);
			}
		};

		fetchBalances();
	}, [view, user]);

	if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
	if (!user) return <div className="min-h-screen flex items-center justify-center">Please log in.</div>;

	const netBalanceStr = Math.abs(totals.net).toFixed(2);
	const heroColor = totals.net >= 0 ? 'text-teal-500' : 'text-orange-600';
	const heroText = totals.net >= 0 ? `You are owed $${netBalanceStr}` : `You owe $${netBalanceStr}`;
	const isSpendLower = insights !== null && insights.spendChange !== null && insights.spendChange < 0;
	
	const spendChangeText = insights !== null && insights.spendChange !== null 
		? `${Math.abs(insights.spendChange).toFixed(0)}% ${isSpendLower ? 'lower' : 'higher'}` 
		: 'new';

	return (
		<div className="min-h-screen flex">
			<Sidebar />
			<main className="flex-1 flex flex-col min-h-screen pt-2">
				<Header title="" />

				<div className="xl:pl-64 sm:px-8 pb-12 gap-8 ">
					<header className="text-center space-y-4">
						<p className="text-[10px] uppercase tracking-widest font-medium text-slate-400">Your Net Position</p>

						{/*  HERO SKELETON  */}
						<h1 className={`text-5xl md:text-6xl font-bold flex justify-center ${heroColor}`}>
							{isFetchingBalances ? (
								<div className="h-14 md:h-16 w-80 bg-slate-200 animate-pulse rounded-2xl"></div>
							) : (
								heroText
							)}
						</h1>

						<div className="inline-flex bg-slate-200/50 p-1 rounded-xl border border-slate-200">
							<button onClick={() => setView('group')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'group' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>👥 By Group</button>
							<button onClick={() => setView('person')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'person' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>👤 By Person</button>
						</div>
					</header>
				</div>

				<MainContainer columnsNum={2}>
					<section className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="flex items-center gap-2 font-bold text-slate-800">
								<span className="text-teal-500 font-black">↗</span> Owed to You
							</h3>
							{/* Small amount skeleton */}
							{isFetchingBalances ? (
								<span className="h-6 w-16 bg-teal-100 animate-pulse rounded-full"></span>
							) : (
								<span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-xs font-bold">+${totals.pos.toFixed(2)}</span>
							)}
						</div>

						<div className="space-y-4">
							{/* 🌟 LIST SKELETON (Renders 2 fake cards) 🌟 */}
							{isFetchingBalances ? (
								Array.from({ length: 2 }).map((_, i) => (
									<div key={i} className="h-[120px] w-full bg-slate-100 animate-pulse rounded-2xl border border-slate-200"></div>
								))
							) : owedToMe.length === 0 ? (
								<p className="text-sm text-slate-400">No one owes you anything right now.</p>
							) : (
								owedToMe.map(item => (
									<BalanceCard key={item.id} item={item} onAction={(id) => console.log('Reminding group', id)} />
								))
							)}
						</div>
					</section>

					<section className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="flex items-center gap-2 font-bold text-slate-800">
								<span className="text-red-500 font-black">↘</span> You Owe
							</h3>
							{/* Small amount skeleton */}
							{isFetchingBalances ? (
								<span className="h-6 w-16 bg-red-100 animate-pulse rounded-full"></span>
							) : (
								<span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">-${totals.neg.toFixed(2)}</span>
							)}
						</div>
						<div className="space-y-4">
							{/* 🌟 LIST SKELETON (Renders 2 fake cards) 🌟 */}
							{isFetchingBalances ? (
								Array.from({ length: 2 }).map((_, i) => (
									<div key={i} className="h-[120px] w-full bg-slate-100 animate-pulse rounded-2xl border border-slate-200"></div>
								))
							) : iOwe.length === 0 ? (
								<p className="text-sm text-slate-400">You are all settled up!</p>
							) : (
								iOwe.map(item => (
									<BalanceCard key={item.id} item={item} onAction={(id) => console.log('Paying group', id)} />
								))
							)}
						</div>
					</section>

					{/* --- INSIGHTS CARD --- */}
					<section className="bg-teal-50/50 border border-teal-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 xl:col-span-2">
						<div className="max-w-md space-y-4 w-full">
							<h3 className="text-2xl font-bold text-slate-900">Flow Insights</h3>

							{/* 🌟 INSIGHTS TEXT SKELETON 🌟 */}
							{isFetchingInsights ? (
								<div className="space-y-2 py-1">
									<div className="h-4 bg-teal-100 animate-pulse rounded w-full"></div>
									<div className="h-4 bg-teal-100 animate-pulse rounded w-4/5"></div>
								</div>
							) : (
								<p className="text-slate-600 leading-relaxed">
									Your spending this month is <span className={`font-bold ${isSpendLower ? 'text-teal-600' : 'text-orange-600'}`}>{spendChangeText}</span> than last month.
									Most of your debts are from the <span className="font-bold">"{insights?.topDebtGroupName || 'None'}"</span> group.
								</p>
							)}

							<div className="flex gap-4">
								<div className="bg-white p-4 rounded-2xl shadow-sm flex-1">
									<p className="text-[10px] uppercase font-bold text-slate-400">Monthly Spend</p>
									{isFetchingInsights ? (
										<div className="h-7 w-20 bg-slate-200 animate-pulse rounded mt-1"></div>
									) : (
										<p className="text-xl font-black text-slate-900">${insights?.monthlySpend.toFixed(2) || '0.00'}</p>
									)}
								</div>
								<div className="bg-white p-4 rounded-2xl shadow-sm flex-1">
									<p className="text-[10px] uppercase font-bold text-slate-400">Settled</p>
									{isFetchingInsights ? (
										<div className="h-7 w-16 bg-slate-200 animate-pulse rounded mt-1"></div>
									) : (
										<p className="text-xl font-black text-teal-500">{insights?.settledPercentage || 0}%</p>
									)}
								</div>
							</div>
						</div>

						{/* 🌟 CIRCULAR PROGRESS SKELETON 🌟 */}
						{isFetchingInsights ? (
							<div className="w-48 h-48 rounded-full bg-teal-100/50 animate-pulse flex items-center justify-center flex-shrink-0">
								<div className="w-40 h-40 rounded-full bg-teal-50/50"></div>
							</div>
						) : (
							<RecoveredProgress percentage={insights?.recoveredPercentage || 0} />
						)}
					</section>

				</MainContainer>
		</main>
	</div>
);
};

export default BalancePage;


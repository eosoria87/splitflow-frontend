import {
	MagnifyingGlassIcon, UserGroupIcon,
	Square3Stack3DIcon, EllipsisVerticalIcon, BanknotesIcon,
	CheckCircleIcon,
	CreditCardIcon
} from "@heroicons/react/24/outline";
import MainContainer from "../components/ui/MainContainer";
import Header from "../components/layout/Header";
import KpiCard from "../components/audit/KpiCard";
import { categoryConfig } from "../constants/transactionCategories";
import Sidebar from "../components/layout/Sidebar";

import { expenseService, type ExpenseLog, type ExpenseKPIs } from "../services/expenseService";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState, useMemo } from "react";
import FilterSelect from "../components/audit/FilterSelect";

const getStatusColors = (status: string) => {
	switch (status.toLowerCase()) {
		case 'settled': return "bg-teal-50 text-primary";
		case 'pending': return "bg-orange-50 text-orange-600";
		case 'disputed': return "bg-red-50 text-red-600";
		default: return "bg-teal-50 text-slate-400";
	}
}

const formatAmount = (n: number) =>
	n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	const AuditLogPage = () => {
	const { user, isLoading } = useAuth();
	
	const [isFetching, setIsFetching] = useState(true);
	const [logs, setLogs] = useState<ExpenseLog[]>([]);
	const [kpis, setKpis] = useState<ExpenseKPIs>({ totalVolume: 0, youPaid: 0, totalTransactions: 0, activeGroups: 0 });

	// 🌟 1. FILTER STATES 🌟
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedGroup, setSelectedGroup] = useState("All Groups");
	const [selectedCategory, setSelectedCategory] = useState("All Categories");

	useEffect(() => {
		const fetchExpenses = async () => {
			if (!user) return;
			setIsFetching(true);
			try {
				const data = await expenseService.getAllUserExpenses(user.id);
				setLogs(data.logs);
				setKpis(data.kpis);
			} finally {
				setIsFetching(false);
			}
		};

		fetchExpenses();
	}, [user]);

	// 🌟 2. EXTRACT DYNAMIC OPTIONS 🌟
	const uniqueGroups = useMemo(() => {
		const groups = Array.from(new Set(logs.map(log => log.group)));
		return ["All Groups", ...groups];
	}, [logs]);

	const uniqueCategories = useMemo(() => {
		const categories = Array.from(new Set(logs.map(log => log.category)));
		// Capitalize the category names for the UI
		const formattedCategories = categories.map(c => c.charAt(0).toUpperCase() + c.slice(1));
		return ["All Categories", ...formattedCategories];
	}, [logs]);

	// 🌟 3. FILTER THE LOGS 🌟
	const filteredLogs = useMemo(() => {
		return logs.filter((log) => {
			// Search matches description or payer name
			const matchesSearch = 
				log.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
				log.payerName.toLowerCase().includes(searchQuery.toLowerCase());
			
			// Group match
			const matchesGroup = selectedGroup === "All Groups" || log.group === selectedGroup;
			
			// Category match
			const formattedLogCategory = log.category.charAt(0).toUpperCase() + log.category.slice(1);
			const matchesCategory = selectedCategory === "All Categories" || formattedLogCategory === selectedCategory;

			return matchesSearch && matchesGroup && matchesCategory;
		});
	}, [logs, searchQuery, selectedGroup, selectedCategory]);

	// 🌟 4. HELPER TO CLEAR FILTERS 🌟
	const hasActiveFilters = searchQuery !== "" || selectedGroup !== "All Groups" || selectedCategory !== "All Categories";
	const clearAllFilters = () => {
		setSearchQuery("");
		setSelectedGroup("All Groups");
		setSelectedCategory("All Categories");
	};


	if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
	if (!user) return <div className="min-h-screen flex items-center justify-center">Please log in.</div>;

	return (
		<div className="min-h-screen flex">
			<Sidebar/>
			<main className="flex-1 flex flex-col min-h-screen">
				<Header title="All Expenses" customAction={<></>} />

				<MainContainer columnsNum={1}>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
						<KpiCard icon={<BanknotesIcon />} title="Total Volume" value={`$${formatAmount(kpis.totalVolume)}`} color="teal" isLoading={isFetching} />
						<KpiCard icon={<CreditCardIcon />} title="You Paid" value={`$${formatAmount(kpis.youPaid)}`} color="orange" isLoading={isFetching} />
						<KpiCard icon={<CheckCircleIcon />} title="Total Transactions" value={kpis.totalTransactions.toString()} color="teal" isLoading={isFetching} />
						<KpiCard icon={<UserGroupIcon />} title="Active Groups" value={kpis.activeGroups.toString()} color="slate" isLoading={isFetching} />
					</div>

					<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
						{/* Filters Section */}
						<div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3 flex-1">
								
								{/* Search Input */}
								<div className="relative flex-1 lg:max-w-xs">
									<MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
									<input 
										type="text" 
										placeholder="Search transactions..." 
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/20 outline-none transition-all" 
									/>
								</div>

								{/* Dropdowns wired to state! */}
								<FilterSelect 
									icon={<UserGroupIcon />} 
									value={selectedGroup} 
									options={uniqueGroups} 
									onChange={setSelectedGroup} 
								/>
								<FilterSelect 
									icon={<Square3Stack3DIcon />} 
									value={selectedCategory} 
									options={uniqueCategories} 
									onChange={setSelectedCategory} 
								/>
							</div>

							{/* Active Filters Summary */}
							<div className={`flex items-center gap-3 text-sm shrink-0 transition-opacity duration-300 ${hasActiveFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
								<span className="text-slate-500 hidden lg:inline">ACTIVE FILTERS:</span>
								
								{selectedGroup !== "All Groups" && (
									<span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full font-medium text-xs flex items-center gap-1 cursor-pointer" onClick={() => setSelectedGroup("All Groups")}>
										{selectedGroup} <span className="text-teal-400 hover:text-teal-600 text-sm">×</span>
									</span>
								)}
								{selectedCategory !== "All Categories" && (
									<span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full font-medium text-xs flex items-center gap-1 cursor-pointer" onClick={() => setSelectedCategory("All Categories")}>
										{selectedCategory} <span className="text-teal-400 hover:text-teal-600 text-sm">×</span>
									</span>
								)}
								{searchQuery !== "" && (
									<span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full font-medium text-xs flex items-center gap-1 cursor-pointer" onClick={() => setSearchQuery("")}>
										Search <span className="text-teal-400 hover:text-teal-600 text-sm">×</span>
									</span>
								)}

								<button onClick={clearAllFilters} className="text-slate-400 hover:text-slate-700 underline decoration-slate-300 underline-offset-2 ml-1">Clear all</button>
							</div>
						</div>

						{/* Table Section */}
						<div className="overflow-x-auto min-h-[400px]">
							<table className="w-full text-left border-collapse whitespace-nowrap">
								{/* ... (Keep your existing thead exactly the same) ... */}
								<thead>
									<tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-500 font-bold bg-slate-50/50">
										<th className="p-4 w-12"><input type="checkbox" className="rounded border-slate-300 text-teal-500 focus:ring-teal-500" /></th>
										<th className="p-4">Date</th>
										<th className="p-4 min-w-50">Description</th>
										<th className="p-4 hidden sm:table-cell">Group</th>
										<th className="p-4 hidden lg:table-cell">Category</th>
										<th className="p-4 hidden xl:table-cell">Payer</th>
										<th className="p-4 hidden md:table-cell">Total</th>
										<th className="p-4 hidden md:table-cell">Status</th>
										<th className="p-4 w-12"></th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-50 relative">
									{isFetching ? (
										Array.from({ length: 5 }).map((_, i) => (
											<tr key={`skeleton-${i}`} className="animate-pulse bg-white">
												{/* ... (Keep your existing skeleton loader TDs here!) ... */}
												<td className="p-4"><div className="h-4 w-4 bg-slate-200 rounded"></div></td>
												<td className="p-4">
													<div className="h-4 w-20 bg-slate-200 rounded mb-1"></div>
													<div className="h-3 w-12 bg-slate-100 rounded"></div>
												</td>
												<td className="p-4"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
												<td className="p-4 hidden sm:table-cell"><div className="h-5 w-24 bg-slate-100 rounded"></div></td>
												<td className="p-4 hidden lg:table-cell"><div className="h-4 w-20 bg-slate-200 rounded"></div></td>
												<td className="p-4 hidden xl:table-cell"><div className="h-6 w-6 rounded-full bg-slate-200"></div></td>
												<td className="p-4 hidden md:table-cell"><div className="h-4 w-16 bg-slate-200 rounded"></div></td>
												<td className="p-4 hidden md:table-cell"><div className="h-5 w-16 rounded-full bg-slate-100"></div></td>
												<td className="p-4 text-right"><div className="h-5 w-5 bg-slate-200 rounded ml-auto"></div></td>
											</tr>
										))
									) : filteredLogs.length === 0 ? (
										<tr>
											{/* Make sure the colSpan matches your columns! */}
											<td colSpan={9} className="p-12 text-center">
												<div className="flex flex-col items-center justify-center space-y-3">
													<MagnifyingGlassIcon className="w-8 h-8 text-slate-300" />
													<p className="text-slate-500 font-medium">No expenses found matching your filters.</p>
													{hasActiveFilters && (
														<button onClick={clearAllFilters} className="text-teal-600 text-sm font-semibold hover:text-teal-700">
															Clear filters
														</button>
													)}
												</div>
											</td>
										</tr>
									) : (
										// 🌟 USE filteredLogs HERE INSTEAD OF logs 🌟
										filteredLogs.map((log) => {
											const config = categoryConfig[log.category as keyof typeof categoryConfig] ?? categoryConfig.other;
											const CategoryIcon = config.icon;

											return (
												<tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
													{/* ... (Keep your existing real data TR body here!) ... */}
													<td className="p-4"><input type="checkbox" className="rounded border-slate-300 text-teal-500 focus:ring-teal-500" /></td>
													<td className="p-4">
														<p className="text-sm font-medium text-slate-900">{log.date}</p>
														<p className="text-xs text-slate-400">{log.time}</p>
													</td>
													<td className="p-4">
														<p className="text-sm font-bold text-slate-900">{log.description}</p>
													</td>
													<td className="p-4 hidden sm:table-cell">
														<span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">{log.group}</span>
													</td>
													<td className="p-4 hidden lg:table-cell text-sm text-slate-600">
														<div className="flex items-center gap-2">
															<CategoryIcon className="w-4 h-4 text-slate-400" />
															<span className="capitalize">{config.name || log.category}</span>
														</div>
													</td>
													<td className="p-4 hidden xl:table-cell">
														<div className="relative inline-flex items-center cursor-pointer group/tooltip">
															{log.payerAvatar ? (
																<img src={log.payerAvatar} alt={log.payerName} className="w-6 h-6 rounded-full object-cover shadow-sm" />
															) : (
																<div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
																	{log.payerName.charAt(0).toUpperCase()}
																</div>
															)}
															<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
																{log.payerName}
																<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
															</div>
														</div>
													</td>
													<td className="p-4 hidden md:table-cell font-bold text-slate-900">
														${log.amount.toFixed(2)}
													</td>
													<td className="p-4 hidden md:table-cell">
														<span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${getStatusColors(log.status)}`}>
															{log.status}
														</span>
													</td>
													<td className="p-4 text-right">
														<button className="text-slate-400 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity">
															<EllipsisVerticalIcon className="w-5 h-5" />
														</button>
													</td>
												</tr>
											);
										})
									)}
								</tbody>
							</table>
						</div>

						{/* Pagination Footer */}
						<div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
							<div>
								{/* 🌟 Update Footer to use filteredLogs.length 🌟 */}
								Showing <span className="font-bold text-slate-900">{filteredLogs.length > 0 ? 1 : 0}</span> to <span className="font-bold text-slate-900">{filteredLogs.length}</span> of <span className="font-bold text-slate-900">{filteredLogs.length}</span> results
							</div>
							<div className="flex items-center gap-4">
								<span className="hidden sm:inline">Rows per page: 10</span>
								<div className="flex gap-1">
									<button className="px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-900 shadow-sm font-medium">1</button>
								</div>
							</div>
						</div>

					</div>
				</MainContainer>
			</main>
		</div>
	);
};

export default AuditLogPage;

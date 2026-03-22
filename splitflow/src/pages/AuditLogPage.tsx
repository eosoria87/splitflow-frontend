import {
	MagnifyingGlassIcon, UserGroupIcon,
	Square3Stack3DIcon, EllipsisVerticalIcon, BanknotesIcon,
	CheckCircleIcon,
	CreditCardIcon
} from "@heroicons/react/24/outline";
import MainContainer from "../components/ui/MainContainer";
import Header from "../components/layout/Header";
import KpiCard from "../components/audit/KpiCard";
import Sidebar from "../components/layout/Sidebar";
import FilterSelect from "../components/audit/FilterSelect";
import { categoryConfig } from "../constants/transactionCategories";
import { expenseService, type ExpenseKPIs, type ExpenseLog } from "../services/expenseService";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { formatAmount } from "../utils/formatters";
import { getStatusColors } from "../utils/themeUtils";
import { useExpenseTable } from "../hooks/useExpenseTable";


const AuditLogPage = () => {
	const { user, isLoading } = useAuth();
	const [logs, setLogs] = useState<ExpenseLog[]>([]);
	const [isFetching, setIsFetching] = useState(true);
	const [kpis, setKpis] = useState<ExpenseKPIs>({ totalVolume: 0, youPaid: 0, totalTransactions: 0, activeGroups: 0 });

	const {
        // State
        inputValue, setInputValue,
        searchQuery, setSearchQuery,
        selectedGroup, setSelectedGroup,
        selectedCategory, setSelectedCategory,
        currentPage, setCurrentPage,
        rowsPerPage, setRowsPerPage,
        
        // Computed Values
        uniqueGroups, uniqueCategories,
        filteredLogs, paginatedLogs,
        totalPages, startIndex, endIndex,
        
        // Helpers
        hasActiveFilters, clearAllFilters
    } = useExpenseTable(logs);

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

	if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
	if (!user) return <div className="min-h-screen flex items-center justify-center">Please log in.</div>;

	const startItem = filteredLogs.length === 0 ? 0 : startIndex + 1;
	const endItem = Math.min(endIndex, filteredLogs.length);

	return (
		<div className="min-h-screen flex">
			<Sidebar />
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
										value={inputValue}
										onChange={(e) => setInputValue(e.target.value)}
										className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
									/>
									{/* The clear button (only shows if there's text) */}
									{inputValue && (
										<button
											onClick={() => setInputValue("")}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-lg leading-none"
											aria-label="Clear search"
										>
											×
										</button>
									)}
								</div>

								{/* Dropdowns */}
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
						<div className="overflow-x-auto min-h-100">
							<table className="w-full text-left border-collapse whitespace-nowrap">
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
										paginatedLogs.map((log) => {
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

							{/* Showing X to Y of Z */}
							<div>
								Showing <span className="font-bold text-slate-900">{startItem}</span> to <span className="font-bold text-slate-900">{endItem}</span> of <span className="font-bold text-slate-900">{filteredLogs.length}</span> results
							</div>

							<div className="flex items-center gap-4">

								{/* Rows Per Page Dropdown */}
								<div className="hidden sm:flex items-center gap-2">
									<span>Rows per page:</span>
									<select
										value={rowsPerPage}
										onChange={(e) => {
											setRowsPerPage(Number(e.target.value));
											setCurrentPage(1); // Reset to page 1 when changing row count
										}}
										className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer"
									>
										<option value={5}>5</option>
										<option value={10}>10</option>
										<option value={20}>20</option>
										<option value={50}>50</option>
									</select>
								</div>

								{/* Interactive Page Buttons */}
								<div className="flex gap-1">
									<button
										onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
										disabled={currentPage === 1}
										className="px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors"
									>
										Prev
									</button>

									{/* Dynamic Page Numbers */}
									{Array.from({ length: totalPages }).map((_, i) => {
										const page = i + 1;
										return (
											<button
												key={page}
												onClick={() => setCurrentPage(page)}
												className={`px-3 py-1 border rounded transition-colors ${currentPage === page
													? 'border-teal-500 bg-teal-50 text-teal-700 font-bold shadow-sm'
													: 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
													}`}
											>
												{page}
											</button>
										);
									})}
									<button
										onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
										disabled={currentPage === totalPages || totalPages === 0}
										className="px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors"
									>
										Next
									</button>
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

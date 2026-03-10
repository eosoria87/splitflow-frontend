import {
	ArrowDownTrayIcon, MagnifyingGlassIcon, CalendarIcon, UserGroupIcon,
	Square3Stack3DIcon, EllipsisVerticalIcon, BanknotesIcon, ClockIcon,
	CheckCircleIcon, ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import MainContainer from "../components/ui/MainContainer";
import Header from "../components/navigation/Header"; 
import Button from "../components/ui/Button";
import KpiCard from "../components/ui/KpiCard";
import FilterSelect from "../components/ui/FilterSelect";
import { mockAuditLogs } from "../data/mockAuditLogs";
import { categoryConfig } from "../constants/transactionCategories";
import Sidebar from "../components/navigation/Sidebar";

const statusColors = {
	Settled: "bg-teal-50 text-primary",
	Pending: "bg-orange-50 text-orange-600",
	Disputed: "bg-red-50 text-red-600",
};

const AuditLogPage = () => {
	{/* Custom Button (Export CSV) for Header component */}
	const exportButton = (
		<Button
			variant="primary"
			onClick={() => console.log('Exporting CSV...')}
			className="py-2.5 px-4 flex items-center gap-2 shrink-0"
		>
			<ArrowDownTrayIcon className="w-4 h-4" />
			<span className="hidden sm:inline">Export CSV</span>
		</Button>
	);

	return (
		<div className=" ">
			<Sidebar/>

			{/* Header with Export Button */}
			<Header 
				title="Audit Log & History"
				customAction={exportButton}/>

			{/* Use columnsNum=1 so it acts as a full-width container */}
			<MainContainer columnsNum={1}>

				{/* --- KPI CARDS ROW --- */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
					<KpiCard icon={<BanknotesIcon />} title="Total Spent (Oct)" value="$4,250.00" color="teal" />
					<KpiCard icon={<ClockIcon />} title="Pending" value="$340.50" color="orange" />
					<KpiCard icon={<CheckCircleIcon />} title="Settled Transactions" value="128" color="teal" />
					<KpiCard icon={<ExclamationTriangleIcon />} title="Disputed" value="2" color="red" />
				</div>

				{/* --- MAIN TABLE CARD --- */}
				<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">

					{/* Filters Section */}
					<div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3 flex-1">
							{/* Search */}
							<div className="relative flex-1 lg:max-w-xs">
								<MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
								<input type="text" placeholder="Search transactions..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/20 outline-none" />
							</div>
							{/* Dropdowns */}
							<FilterSelect icon={<CalendarIcon />} text="Oct 1 - Oct 31, 2023" />
							<FilterSelect icon={<UserGroupIcon />} text="All Groups" />
							<FilterSelect icon={<Square3Stack3DIcon />} text="All Categories" />
						</div>

						{/* Active Filters */}
						<div className="flex items-center gap-3 text-sm shrink-0">
							<span className="text-slate-500 hidden lg:inline">ACTIVE FILTERS:</span>
							<span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full font-medium text-xs flex items-center gap-1 cursor-pointer">
								Date: Oct <span className="text-teal-400 hover:text-teal-600">×</span>
							</span>
							<button className="text-slate-400 hover:text-slate-700 underline decoration-slate-300 underline-offset-2">Clear all</button>
						</div>
					</div>

					{/* Table Section */}
					<div className="overflow-x-auto">
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
							<tbody className="divide-y divide-slate-50">
								{mockAuditLogs.map((log) => {
									const { icon: CategoryIcon } = categoryConfig[log.category];
									return (
										<tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
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
													<span className="capitalize">{categoryConfig[log.category].name || log.category}</span>
												</div>
											</td>
											<td className="p-4 hidden xl:table-cell">
												{/* 1. We added 'group' and 'relative' to this wrapper */}
												<div className="relative inline-flex items-center cursor-pointer group">

													{/* Avatar / Initials */}
													{log.payerAvatar ? (
														<img src={log.payerAvatar} alt={log.payerName} className="w-6 h-6 rounded-full object-cover shadow-sm" />
													) : (
														<div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
															{log.payerName.charAt(0)}
														</div>
													)}

													{/* 2. The Custom Tooltip */}
													<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
														{log.payerName}

														{/* 3. The little downward-pointing triangle */}
														<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
													</div>

												</div>
											</td>
											<td className="p-4 hidden md:table-cell font-bold text-slate-900">
												${log.amount.toFixed(2)}
											</td>
											<td className="p-4 hidden md:table-cell">
												<span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${statusColors[log.status]}`}>
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
								})}
							</tbody>
						</table>
					</div>

					{/* Pagination Footer */}
					<div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
						<div>Showing <span className="font-bold text-slate-900">1</span> to <span className="font-bold text-slate-900">4</span> of <span className="font-bold text-slate-900">1,230</span> results</div>

						{/* Pagination Controls Placeholder */}
						<div className="flex items-center gap-4">
							<span className="hidden sm:inline">Rows per page: 10</span>
							<div className="flex gap-1">
								<button className="px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50">1</button>
								<button className="px-3 py-1 border border-slate-200 rounded text-slate-400">2</button>
								<button className="px-3 py-1 border border-slate-200 rounded text-slate-400">3</button>
							</div>
						</div>
					</div>

				</div>
			</MainContainer>
		</div>
	);
};

export default AuditLogPage;

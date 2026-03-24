import { MagnifyingGlassIcon, FolderIcon, TagIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import Dropdown, { type DropdownOption } from "../ui/Dropdown";
import type { ExpenseFilters } from "../../services/allExpensesService";
import type { TransactionCategory } from "../../types/Transaction";
import { categoryConfig } from "../../constants/transactionCategories";

interface Props {
	filters: ExpenseFilters;
	groups: { id: string; name: string }[];
	availableCategories: TransactionCategory[];
	onChange: (filters: ExpenseFilters) => void;
}

const STATUS_OPTIONS: DropdownOption[] = [
	{ value: 'all', label: 'All Status' },
	{ value: 'you lent', label: 'You Lent' },
	{ value: 'you owe', label: 'You Owe' },
];

const ExpenseFilterBar = ({ filters, groups, availableCategories, onChange }: Props) => {
	const set = <K extends keyof ExpenseFilters>(key: K, value: ExpenseFilters[K]) =>
		onChange({ ...filters, [key]: value });

	const groupOptions: DropdownOption[] = [
		{ value: '', label: 'All Groups' },
		...groups.map(g => ({ value: g.id, label: g.name })),
	];

	const categoryOptions: DropdownOption[] = [
		{ value: 'all', label: 'All Categories' },
		...availableCategories.map(cat => ({ value: cat, label: categoryConfig[cat].name })),
	];

	return (
		<div className="flex flex-col sm:flex-row gap-3">
			<div className="relative flex-1">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
				</div>
				<input
					type="text"
					value={filters.search}
					onChange={e => set('search', e.target.value)}
					placeholder="Search expenses…"
					className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
				/>
			</div>

			<Dropdown
				options={groupOptions}
				value={filters.groupId}
				onChange={v => set('groupId', v)}
				icon={<FolderIcon className="w-4 h-4" />}
			/>

			<Dropdown
				options={STATUS_OPTIONS}
				value={filters.status}
				onChange={v => set('status', v as ExpenseFilters['status'])}
				icon={<AdjustmentsHorizontalIcon className="w-4 h-4" />}
			/>

			<div className="w-48 shrink-0">
				<Dropdown
					options={categoryOptions}
					value={filters.category}
					onChange={v => set('category', v as ExpenseFilters['category'])}
					icon={<TagIcon className="w-4 h-4" />}
				/>
			</div>
		</div>
	);
};

export default ExpenseFilterBar;

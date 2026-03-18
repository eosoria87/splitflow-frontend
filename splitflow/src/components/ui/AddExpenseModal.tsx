import { CalendarIcon, CheckIcon, PencilIcon, Squares2X2Icon, XMarkIcon } from "@heroicons/react/24/solid";
// CheckIcon is used in the Save button; Squares2X2Icon is passed as icon prop to Dropdown
import Button from "./Button";
import Dropdown from "./Dropdown";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../../utils/apiClient";

const CATEGORIES: { value: string; label: string }[] = [
	{ value: "food", label: "Food & Dining" },
	{ value: "transport", label: "Transport" },
	{ value: "accommodation", label: "Accommodation" },
	{ value: "entertainment", label: "Entertainment" },
	{ value: "utilities", label: "Utilities" },
	{ value: "other", label: "Other" },
];

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const today = new Date().toISOString().split('T')[0];

const getCurrentUserName = (): string => {
	try { return JSON.parse(localStorage.getItem('sf_user') || '{}').name ?? 'You'; }
	catch { return 'You'; }
};

const AddExpenseModal = ({ isOpen, onClose }: Props) => {
	const { id: groupId } = useParams<{ id: string }>();
	const currentUserName = getCurrentUserName();

	const [amount, setAmount] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [date, setDate] = useState<string>(today);
	const [category, setCategory] = useState<string>("food");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isFormValid =
		description.trim() !== '' &&
		!!amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 &&
		date !== '' &&
		category !== '-';

	const resetForm = () => {
		setAmount("");
		setDescription("");
		setDate(today);
		setCategory("food");
		setError(null);
	};
	const handleSave = async () => {
		if (!groupId) return;
		if (!description.trim()) { setError('Description is required.'); return; }
		if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) { setError('Enter a valid amount.'); return; }

		setError(null);
		setIsLoading(true);
		try {
			await apiClient.post(`/groups/${groupId}/expenses`, {
				description: description.trim(),
				amount: parseFloat(amount),
				date,
				category,
			});
			sessionStorage.removeItem(`sf_group_${groupId}`);
			window.dispatchEvent(new CustomEvent('expense-added', { detail: { groupId } }));
			resetForm();
			onClose();
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Failed to save expense. Please try again.';
			setError(message);
		} finally {
			setIsLoading(false);
		}
	};
	const handleClose = () => {
		resetForm(); 
		onClose();  
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm sm:p-6">

			{/* max-h-[90vh] ensures it doesn't grow taller than the screen, and flex-col allows internal scrolling */}
			<div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

				{/* --- HEADER --- */}
				<div className="flex bg-[#f2fbfb] items-start justify-between p-6 border-b border-slate-100 shrink-0">
					<div>
						<h2 className="text-xl font-bold text-left text-slate-900">Add New Expense</h2>
						<p className="text-sm text-slate-500 mt-1">Enter details to split costs with the group.</p>
					</div>
					<button
						onClick={handleClose}
						className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
					>
						<XMarkIcon className="w-5 h-5" />
					</button>
				</div>


				<div className="p-6 overflow-y-auto flex-1 space-y-8 text-left">

					<div className="flex flex-col items-center">
						<label className="text-xs font-bold text-teal-500 tracking-wider uppercase mb-2">
							Total Amount
						</label>
						<div className="flex items-center gap-2 border-b-2 border-teal-100 focus-within:border-teal-400 transition-colors pb-2 w-48 justify-center">
							<span className="text-4xl font-bold text-teal-500">$</span>
							<input
								type="number"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								placeholder="0.00"
								className="w-full text-4xl text-center font-bold text-slate-300 focus:text-slate-800 bg-transparent border-none outline-none focus:ring-0 p-0"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">

						{/* Description */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
									<PencilIcon className="w-5 h-5" />
								</div>
								<input
									type="text"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="e.g. Sushi Dinner"
									className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
								/>
							</div>
						</div>

						{/* Category */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
							<Dropdown
								options={CATEGORIES}
								value={category}
								onChange={setCategory}
								icon={<Squares2X2Icon className="w-5 h-5" />}
							/>
						</div>

						{/* Date */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
									<CalendarIcon className="w-5 h-5" />
								</div>
								<input
									type="date"
									value={date}
									onChange={(e) => setDate(e.target.value)}
									className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
								/>
							</div>
						</div>

						{/* Paid By */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1.5">Paid by</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold">
										{currentUserName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
									</div>
								</div>
								<div className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700">
									{currentUserName}
								</div>
							</div>
						</div>

					</div>

					

				</div>

				{/* --- FOOTER --- */}
				<div className="p-6 border-t border-slate-100 bg-white shrink-0 rounded-b-2xl">
					{error && (
						<p className="text-sm text-red-500 font-medium mb-3 text-right">{error}</p>
					)}
					<div className="flex justify-end gap-3">
						<Button variant="outline" onClick={handleClose} disabled={isLoading} className="py-2.5">
							Cancel
						</Button>
						<Button variant="primary" onClick={handleSave} disabled={isLoading || !isFormValid} className="py-2.5 flex items-center gap-2">
							{isLoading ? (
								<svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
								</svg>
							) : (
								<CheckIcon className="w-4 h-4" />
							)}
							{isLoading ? 'Saving...' : 'Save Expense'}
						</Button>
					</div>
				</div>

			</div>
		</div>
	);

};

export default AddExpenseModal;


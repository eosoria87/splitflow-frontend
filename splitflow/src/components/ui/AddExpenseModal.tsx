import { ArrowsRightLeftIcon, CalendarIcon, CheckIcon, ChevronDownIcon, PencilIcon, Squares2X2Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Button from "./Button";
import { useState } from "react";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const AddExpenseModal = ({ isOpen, onClose }: Props) => {

	const [splitMethod, setSplitMethod] = useState<'Equally' | 'Percentage' | 'Exact'>('Equally');
	const [amount, setAmount] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [date, setDate] = useState<string>("2023-10-27");

	const resetForm = () => {
		setAmount("");
		setDescription("");
		setDate("2023-10-27");
		setSplitMethod('Equally');
	};
	const handleSave = () => {
		const expenseData = {
			amount: parseFloat(amount),
			description,
			date,
			splitMethod,
		};
		console.log("Saving Data:", expenseData);
		resetForm();
		onClose();
	}
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


				<div className="p-6 overflow-y-auto flex-1 space-y-8">

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

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">

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
							<div className="relative cursor-pointer group">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
									<Squares2X2Icon className="w-5 h-5" />
								</div>
								{/* We use a div styled like an input here since it's likely a custom dropdown in reality */}
								<div className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 group-hover:bg-white transition-colors flex items-center justify-between">
									<span>Food & Dining</span>
								</div>
								<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
									<ChevronDownIcon className="w-4 h-4" />
								</div>
							</div>
						</div>

						{/* Date */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
									<CalendarIcon className="w-5 h-5" />
								</div>
								<input
									type="text"
									value={date}
									onChange={(e) => setDate(e.target.value)}
									defaultValue="10/27/2023"
									className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
								/>
							</div>
						</div>

						{/* Paid By */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1.5">Paid by</label>
							<div className="relative cursor-pointer group">
								<div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
									<img src="https://i.pravatar.cc/150?img=68" alt="You" className="w-6 h-6 rounded-full" />
								</div>
								<div className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 group-hover:bg-white transition-colors flex items-center justify-between">
									<span>You</span>
								</div>
								<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
									<ArrowsRightLeftIcon className="w-4 h-4" />
								</div>
							</div>
						</div>

					</div>

					<div className="border-t border-slate-100 pt-6">

						{/* Split Header & Segmented Control */}
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
							<h3 className="text-sm font-bold text-slate-700">Split Method</h3>

							{/* Segmented Control */}
							<div className="flex items-center bg-slate-50 border border-slate-200 p-1 rounded-lg">
								{['Equally', 'Percentage', 'Exact'].map((method) => (
									<button
										key={method}
										onClick={() => setSplitMethod(method as 'Equally' | 'Percentage' | 'Exact')}
										className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${splitMethod === method
											? 'bg-teal-500 text-white shadow-sm'
											: 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
											}`}
									>
										{method}
									</button>
								))}
							</div>
						</div>

						{/* Users List */}
						<div className="space-y-2 bg-slate-50 p-2 rounded-xl border border-slate-100">

							{/* User 1 (Active/Payer) */}
							<div className="flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors cursor-pointer">
								<div className="flex items-center gap-3">
									<div className="relative">
										<img src="https://i.pravatar.cc/150?img=11" alt="Alex" className="w-10 h-10 rounded-full" />
										<div className="absolute -bottom-1 -left-1 bg-teal-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white">
											You
										</div>
									</div>
									<div>
										<p className="text-sm font-bold text-slate-900">Alex Johnson</p>
										<p className="text-xs text-teal-500 font-medium">Payer</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-sm font-bold text-slate-900">$0.00</p>
									<p className="text-xs text-slate-400">100%</p>
								</div>
							</div>

							{/* User 2 (Inactive) */}
							<div className="flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors cursor-pointer opacity-60 grayscale-[50%]">
								<div className="flex items-center gap-3">
									<img src="https://i.pravatar.cc/150?img=5" alt="Sarah" className="w-10 h-10 rounded-full" />
									<div>
										<p className="text-sm font-medium text-slate-500">Sarah Smith</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-sm font-medium text-slate-400">$0.00</p>
									<p className="text-xs text-slate-300">0%</p>
								</div>
							</div>

						</div>
					</div>

				</div>

				{/* --- FOOTER --- */}
				<div className="p-6 border-t border-slate-100 bg-white shrink-0 flex justify-end gap-3 rounded-b-2xl">
					<Button variant="outline" onClick={handleClose} className="py-2.5">
						Cancel
					</Button>
					<Button variant="primary" onClick={handleSave} className="py-2.5 flex items-center gap-2">
						<CheckIcon className="w-4 h-4" />
						Save Expense
					</Button>
				</div>

			</div>
		</div>
	);

};

export default AddExpenseModal;


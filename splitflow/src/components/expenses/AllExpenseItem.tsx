import { categoryConfig } from "../../constants/transactionCategories";
import type { AllExpense } from "../../services/allExpensesService";

interface Props {
	expense: AllExpense;
}

const AllExpenseItem = ({ expense }: Props) => {
	const { icon: Icon, color } = categoryConfig[expense.category];
	const isNotInvolved = expense.userStatus === 'not involved';
	const isLent = expense.userStatus === 'you lent';

	return (
		<div className="flex items-center justify-between py-4 hover:bg-slate-50/50 transition-colors px-4 sm:px-6">
			<div className="flex items-center gap-4 min-w-0">
				<div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
					<Icon className="w-5 h-5" />
				</div>

				<div className="text-left min-w-0">
					<h4 className="font-bold text-slate-900 text-sm truncate">{expense.description}</h4>
					<div className="flex items-center gap-2 mt-0.5 flex-wrap">
						<p className="text-xs text-slate-500">
							{expense.paidBy} paid ${expense.amount.toFixed(2)} · {expense.participantsCount} people
						</p>
						<span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
							{expense.groupName}
						</span>
					</div>
				</div>
			</div>

			<div className="text-right ml-4 shrink-0">
				{isNotInvolved ? (
					<p className="font-bold text-sm text-slate-400">not involved</p>
				) : (
					<>
						<p className={`font-bold text-sm ${isLent ? 'text-teal-500' : 'text-orange-500'}`}>
							{isLent ? '+ ' : '- '}${Math.abs(expense.userNetChange).toFixed(2)}
						</p>
						<p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
							{expense.userStatus}
						</p>
					</>
				)}
			</div>
		</div>
	);
};

export default AllExpenseItem;

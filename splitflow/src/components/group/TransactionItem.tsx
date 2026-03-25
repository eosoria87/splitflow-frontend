import { categoryConfig } from "../../constants/transactionCategories";
import type { GroupTransaction } from "../../types/Transaction";


interface Props {
	tx: GroupTransaction;
	onClick?: () => void;
}

const TransactionItem = ({ tx, onClick }: Props) => {
	// TypeScript knows `tx.category` will perfectly match a key in `categoryConfig`.
	const { icon: Icon, color } = categoryConfig[tx.category];

	const isNotInvolved = tx.userStatus === 'not involved';
	const isLent = tx.userStatus === 'you lent';

	return (
		<div onClick={onClick} className={`flex items-center justify-between py-4 group transition-colors px-4 sm:px-6 ${onClick ? 'hover:bg-slate-50/50 cursor-pointer' : ''}`}>
			<div className="flex items-center gap-4">

				{/* 2. Apply the dynamic color and render the dynamic Icon */}
				<div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
					<Icon className="w-5 h-5" />
				</div>

				{/* Transaction Text */}
				<div className="text-left">
					<h4 className="font-bold text-slate-900 text-sm">{tx.title}</h4>
					<p className="text-xs text-slate-500 mt-0.5">
						{tx.paidBy} paid ${tx.totalAmount.toFixed(2)} • {tx.splitDetails}
					</p>
				</div>
			</div>

			{/* Right Side: Financial Status */}
			<div className="text-right ml-4 shrink-0">
				{isNotInvolved ? (
					<p className="font-bold text-sm text-slate-400">not involved</p>
				) : (
					<>
						<p className={`font-bold text-sm ${isLent ? 'text-teal-500' : 'text-orange-500'}`}>
							{isLent ? '+ ' : '- '}${Math.abs(tx.userNetChange).toFixed(2)}
						</p>
						<p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
							{tx.userStatus}
						</p>
					</>
				)}
			</div>
		</div>
	);
};

export default TransactionItem;

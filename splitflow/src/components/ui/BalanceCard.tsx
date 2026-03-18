import type { BalanceItem } from '../../types/BalanceItem';
import Button from '../ui/Button';
import { MegaphoneIcon, CreditCardIcon } from "@heroicons/react/24/outline";

interface Props {
	item: BalanceItem;
	onAction: (id: string) => void;
}

const BalanceCard = ({ item, onAction }: Props) => {
	const isOwedToMe = item.type === 'owed-to-me';

	return (
		<div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
			<div className="flex justify-between items-start mb-4">
				<div className="flex gap-3">
					{item.image ? (
						<img
							src={item.image}
							className="w-12 h-12 rounded-full object-cover border border-slate-100"
							alt={item.name}
						/>
					) : (
						<div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
							{/* This renders the icon passed in the item object */}
							{item.icon}
						</div>
					)}
					<div className="text-left">
						<h4 className="font-bold text-slate-900">{item.name}</h4>
						<p className="text-sm text-slate-500">{item.description}</p>
					</div>
				</div>
				<div className="text-right">
					<p className={`text-xl font-bold ${isOwedToMe ? 'text-teal-500' : 'text-red-500'}`}>
						${item.amount.toFixed(2)}
					</p>
					<p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">
						{item.status}
					</p>
				</div>
			</div>

			<Button
				variant={isOwedToMe ? 'outline' : 'primary'}
				className="w-full py-2.5 text-sm flex items-center justify-center gap-2"
				onClick={() => onAction(item.id)}
			>
				{isOwedToMe ? (
					<>
						<MegaphoneIcon className="w-4 h-4" />
						Remind {item.name.includes(' ') ? 'Group' : ''}
					</>
				) : (
					<>
						<CreditCardIcon className="w-4 h-4" />
						Pay Now
					</>
				)}
			</Button>
		</div>
	);
};

export default BalanceCard;


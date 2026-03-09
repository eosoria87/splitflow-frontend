import { CakeIcon, HomeModernIcon, ShoppingBagIcon, TruckIcon } from "@heroicons/react/24/outline";
import type { TransactionCategory } from "../types/Transaction";

export const categoryConfig: Record<TransactionCategory, { icon: React.ElementType, color: string }> = {
	food: { icon: CakeIcon, color: "bg-teal-50 text-teal-500" },
	transport: { icon: TruckIcon, color: "bg-blue-50 text-blue-500" },
	accommodation: { icon: HomeModernIcon, color: "bg-purple-50 text-purple-500" },
	shopping: { icon: ShoppingBagIcon, color: "bg-pink-50 text-pink-500" },
};

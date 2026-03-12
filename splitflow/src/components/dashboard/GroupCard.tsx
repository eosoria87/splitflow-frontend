import { ArrowRightIcon } from "@heroicons/react/16/solid";
import Card from "../ui/Card";
import { TagIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import type { ReactNode } from "react";

export interface GroupCardType {
	icon?: ReactNode;
	iconBgClass?: string;
	status: 'owed' | 'owe' | 'settled';
  amount?: string | null;

	name: string;
	key: string;
	updated_at?: string;
	category?: string;

}


const GroupCard = ({name, updated_at, icon, iconBgClass, status, amount }: GroupCardType) => {

	const getBadgeStyle = () => {
		switch (status) {
			case 'owed': return { bg: 'bg-secondary', text: 'text-primary', label: `OWED ${amount}` };
			case 'owe': return { bg: 'bg-orange-50', text: 'text-orange-600', label: `OWE ${amount}` };
			case 'settled': return { bg: 'bg-slate-100', text: 'text-primary', label: 'SETTLED UP' };
		}
	};

	const badge = getBadgeStyle();
	return (

		<Card className="flex flex-col justify-between h-full hover:shadow-md transition-shadow cursor-pointer">
      
      {/* Top Row: Icon & Badge */}
			<div className="flex justify-between items-start mb-4">
				<div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgClass} [&>svg]:w-5 [&>svg]:h-5`}>
					{icon ? icon : <TagIcon/>}
				</div>
				{badge && 
				<div className={`${badge.bg} ${badge.text} text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide`}>
					{badge.label}
				</div>}
      </div>

      {/* Middle Row: Text Content */}
      <div className="mb-6">
        <h3 className="text-base font-bold sm:text-left text-slate-900">{name}</h3>
        <p className="text-xs text-slate-500 sm:text-left mt-1">Last activity: {updated_at}</p>
      </div>

      {/* Bottom Row: Avatars & Arrow */}
      <div className="flex justify-between items-center mt-auto">
        <div className="flex items-center -space-x-2">
          {/* Mock Avatars */}
          <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 z-30"></div>
          <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-300 z-20"></div>
          <div className="w-6 h-6 rounded-full border-2 border-white bg-teal-100 z-10"></div>
        </div>
				<Button variant="outline" onClick={() => console.log("Clicked on: ", name)}>
        <ArrowRightIcon className="w-4 h-4 text-slate-300" />
				</Button>
      </div>

    </Card>
	);
};

export default GroupCard;


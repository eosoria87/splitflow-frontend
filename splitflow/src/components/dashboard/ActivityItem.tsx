import { type ReactNode } from "react";

interface ActivityItemProps {
	key: string;
	avatar?: ReactNode; // Can be an image tag OR an SVG icon
  personName: string;
  action: string;
  target: string;
  time: string;
  statusText: string;
  statusColor: string;
}

const getColorMap = (statusColor: string) => {
	switch (statusColor.toLowerCase()) {
		case 'orange': return 'text-orange-600';
		case 'green': return 'text-emerald-500';
		case 'teal': return 'text-teal-600';
		case 'slate': return'text-slate-400';
		default: return 'text-accent';
	}
}

const ActivityItem = ({ avatar, personName, action, target, time, statusText, statusColor }: ActivityItemProps) => {
  
  return (
    // py-4 gives each row vertical breathing room
    <div className="flex items-center justify-between py-4 group cursor-pointer hover:bg-slate-50/50 transition-colors -mx-6 px-6">
      
      {/* Left Side: Avatar and Text Content */}
      <div className="flex items-center gap-3">
        
        {/* Avatar Wrapper */}
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
          {avatar} 
        </div> 

        {/* Text Stack */}
        <div className="flex flex-col">
          <p className="sm:text-left text-sm text-slate-600">
            <span className="font-boldtext-slate-900">{personName}</span> {action} <span className="font-bold text-slate-900">"{target}"</span>
          </p>
          <p className={`sm:text-left text-xs font-medium mt-0.5 ${getColorMap(statusColor)}`}>
            {statusText}
          </p>
        </div>

      </div>

      {/* Right Side: Timestamp */}
      <div className="text-xs text-slate-400 font-medium whitespace-nowrap ml-4">
        {time}
      </div>

    </div>
  );
};

export default ActivityItem;

import { CheckBadgeIcon } from '@heroicons/react/24/solid';

const SettlementSuccess = () => {
  return (
    <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,128,128,0.15)] w-[300px] p-6 relative overflow-hidden border-t-8 border-teal-500">
      
      <div className="flex items-center justify-between opacity-40 blur-[1px]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-14 w-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg border-2 border-white shadow-sm">
            JD
          </div>
          <span className="text-sm font-medium text-gray-400">You</span>
        </div>

        <div className="flex flex-col items-center px-4 relative top-2">
           <span className="text-xl font-bold text-gray-400">$42.50</span>
           <div className="w-full h-0.5 bg-gray-300 mt-2 relative">
              <div className="absolute right-0 -top-1 h-2 w-2 border-t-2 border-r-2 border-gray-300 rotate-45"></div>
           </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="h-14 w-14 bg-secondary rounded-full flex items-center justify-center text-accent font-bold text-lg border-2 border-white shadow-sm">
            AM
          </div>
          <span className="text-sm font-medium text-gray-400">Alex</span>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-mint/95 to-teal-50/90 flex flex-col items-center justify-center text-accent z-10 backdrop-blur-sm animate-fadeIn">

        <CheckBadgeIcon className="w-24 h-24 text-primary drop-shadow-md" />
        <h3 className="text-3xl font-extrabold mt-2 tracking-tight">All Settled!</h3>
        <p className="text-sm text-primary font-medium mt-1">Debt cleared instantly.</p>
      </div>

    </div>
  );
};

export default SettlementSuccess;

import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";

const CreateGroupCard = () => {
  return (
    <Link to="/create-group" className="w-full h-full min-h-[160px] rounded-2xl border-2 border-dashed border-slate-200 hover:border-teal-500/50 hover:bg-teal-50/30 transition-colors flex flex-col items-center justify-center gap-3 group cursor-pointer">
      <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-teal-100 transition-colors flex items-center justify-center text-slate-400 group-hover:text-teal-600">
        <PlusIcon className="w-5 h-5" />
      </div>
      <span className="text-sm font-semibold text-slate-500 group-hover:text-teal-700 transition-colors">
        Create new group
      </span>
    </Link>
  );
};

export default CreateGroupCard;

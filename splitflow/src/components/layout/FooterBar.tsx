import { Link } from 'react-router-dom';


const FooterBar = () => {
	return (
		<div className="flex gap-6 mt-8 text-xs font-regular text-accent">
			<Link to="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
			<Link to="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
			<Link to="/help" className="hover:text-slate-600 transition-colors">Help Center</Link>
		</div>
	);
};

export default FooterBar;


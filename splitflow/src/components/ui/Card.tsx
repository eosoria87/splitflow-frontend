
interface Props extends React.PropsWithChildren {
	className?: string;
}

const Card = ({ children , className = ''}: Props) => {
  return (
		<div className={`bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 border border-slate-100 ${className}`}>
			{children}
		</div>
  );
};

export default Card;


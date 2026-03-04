import Button from "../ui/Button";
import Logo from "../ui/Logo";

interface Props {
	onClick: () => void;
}

const NavBar = ({ onClick }: Props) => {
    return (
			<div className='flex justify-between'>
				<Logo />
				<div className="flex items-center gap-4">
					<Button onClick={onClick}>Login</Button></div>
			</div>
    );
};

export default NavBar;


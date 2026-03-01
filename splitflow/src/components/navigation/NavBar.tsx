import Button from "../ui/Button";
import Logo from "../ui/Logo";

interface Props {
	handleClick: () => void;
}

const NavBar = ({ handleClick }: Props) => {
    return (
			<div className='flex justify-between'>
				<Logo />
				<div className="flex items-center gap-4">
					<Button onClick={handleClick}>Login</Button></div>
			</div>
    );
};

export default NavBar;


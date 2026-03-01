import Button from "../ui/Button";
import Logo from "../ui/Logo";

interface Props {
	handleClick: () => void;
}

const NavBarOnboarding = ({ handleClick }: Props) => {
    return (
			<div className='flex justify-between'>
				<Logo />
				<div className="flex items-center gap-4">
					<Button variant="onlyText" className="hidden sm:block" onClick={handleClick}>Skip Intro</Button>
					<Button variant='secondary'>Login</Button></div>
			</div>
    );
};

export default NavBarOnboarding;



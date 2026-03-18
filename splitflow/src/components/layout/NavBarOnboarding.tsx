import Button from "../ui/Button";
import Logo from "../ui/Logo";

interface Props {
	onClick: () => void;
}

const NavBarOnboarding = ({ onClick }: Props) => {
    return (
			<div className='flex justify-between'>
				<Logo />
				<div className="flex items-center gap-4">
					<Button variant="transparent" className="hidden sm:block" onClick={onClick}>Skip Intro</Button>
					<Button variant='secondary' onClick={onClick}>Login</Button></div>
			</div>
    );
};

export default NavBarOnboarding;



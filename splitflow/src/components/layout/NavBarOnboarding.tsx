import Button from "../ui/Button";
import Logo from "../ui/Logo";

interface Props {
	onClick: () => void;
	onSignUp: () => void;
}

const NavBarOnboarding = ({ onClick, onSignUp }: Props) => {
    return (
			<div className='flex justify-between'>
				<Logo />
				<div className="flex items-center gap-4">
					<Button variant="transparent" className="hidden sm:block" onClick={onClick}>Skip Intro</Button>
					<Button variant='secondary' onClick={onClick}>Login</Button>
					<Button variant='primary' onClick={onSignUp}>Sign Up</Button>
				</div>
			</div>
    );
};

export default NavBarOnboarding;



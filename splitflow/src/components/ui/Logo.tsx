import LogoIcon from '../../assets/logo-icon.svg'
import DarkLogoIcon from '../../assets/logo-icon-dark.svg'


const Logo = () => {
  return (
    <div className='flex items-center gap-2 px-2'>
			<img 
				src={LogoIcon} 
				alt="SplitFlow logo" 
				className='h-8 w-7 dark:hidden ' 
			/>
			<img 
				src={DarkLogoIcon} 
				alt="SplitFlow logo" 
				className='hidden h-6 w-6 dark:block' 
			/>
			<span className='selection:bg-primary selection:text-white font-sans font text-xl px-0.5  font-bold text-logo-text '> SplitFlow </span>
    </div>
  );
};

export default Logo;


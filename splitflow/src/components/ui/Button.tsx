import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'transparent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary/90', 
  secondary: 'bg-secondary text-primary hover:bg-secondary/80', 
  outline: 'bg-outline text-primary-dark box-border border border-slate-200 hover:bg-slate-100', 
  danger: 'bg-danger text-danger-text hover:bg-red-100', 
	transparent: 'bg-transparent text-accent font-medium hover:text-accent/80',
};

const sizeClasses = {
  sm: 'px-8 py-1 text-sm',
  md: 'px-8 py-2 text-sm',
  lg: 'px-8 py-3 text-base',
};

const Button = ({variant='primary', size='md', className='', ...props}: ButtonProps) => {
	const base = 'font-semibold rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50';
	const variantClass = variantClasses[variant];
	const sizeClass = sizeClasses[size];
  return (
    <button className={`${base} ${variantClass} ${sizeClass} ${className}`} {...props} />
  );
};

export default Button;


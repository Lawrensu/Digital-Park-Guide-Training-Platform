// Reusable button component with multiple variants
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500';

  const variants = {
    primary: 'bg-green-700 text-white hover:bg-green-800 disabled:bg-gray-400',
    secondary: 'bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400',
    outline: 'border-2 border-green-700 text-green-700 hover:bg-green-50 disabled:border-gray-400 disabled:text-gray-400',
    ghost: 'text-green-700 hover:bg-green-50 disabled:text-gray-400'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

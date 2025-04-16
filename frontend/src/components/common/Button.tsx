import React from 'react';

interface ButtonProps {
  children: React.ReactNode; // Contenu du bouton
  variant?: 'outline' | 'solid'; // Style visuel du bouton
  size?: 'sm' | 'md' | 'lg'; // Taille du bouton
  fullWidth?: boolean;
  onClick?: () => void; // Fonction à exécuter lors du clic
  type?: 'button' | 'submit' | 'reset'; // Type HTML du bouton
  disabled?: boolean; // Si le bouton est désactivé ou non
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'rounded-lg font-medium transition-all duration-200 focus:outline-none';

  const variantClasses = {
    outline: 'border border-gray-800 bg-transparent text-gray-800 hover:bg-gray-100', // Style contour
    solid: 'border-none bg-gray-800 text-white hover:bg-gray-900', // Style plein
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm', // small
    md: 'px-4 py-2 text-base', // mid
    lg: 'px-6 py-3 text-lg', // large
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClass}
    ${disabledClass}
    ${className}
  `;

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >{children}</button>
  );
};

export default Button;

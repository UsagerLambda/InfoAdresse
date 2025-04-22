import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "submit" | "button";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type="button", disabled=false, className=""}) => {
  return (
    <button onClick={onClick} type={type} disabled={disabled} className={className}>
      {children}
    </button>
  );
};

export default Button;

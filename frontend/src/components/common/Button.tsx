import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "submit"
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type="submit" }) => {
  return (
    <button onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export default Button;

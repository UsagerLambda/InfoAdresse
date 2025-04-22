import React from 'react';

interface TextFieldProps {
  label?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  type?: "text" | "password";
  className?: string;
}

const TextField: React.FC<TextFieldProps> = ({ value, onChange, placeholder, name, type="text", required = false, className="", label}) => {
  return (
    <div className='py-1'>
      {label && <label htmlFor={name} className="block mb-1">{label}</label>}
    <input
      required={required}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      className={className}
    />
    </div>
  );
};

export default TextField;

import React from 'react';

interface TextFieldProps {
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  type?: "text" | "password";
}

const TextField: React.FC<TextFieldProps> = ({ value, onChange, placeholder, name, type="text", required = false }) => {
  return (
    <input
      required={required}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
    />
  );
};

export default TextField;

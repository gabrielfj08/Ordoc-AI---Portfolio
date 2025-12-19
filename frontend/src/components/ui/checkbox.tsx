import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox({ className = '', label, onCheckedChange, ...props }: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked);
    props.onChange?.(e);
  };

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className={`h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${className}`}
        {...props}
        onChange={handleChange}
      />
      {label && (
        <label className="ml-2 text-sm text-gray-700">
          {label}
        </label>
      )}
    </div>
  );
}

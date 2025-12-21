import React from 'react';

interface SwitchProps {
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Switch({ id, checked, defaultChecked, onCheckedChange, disabled = false, className = '' }: SwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false);
  const isControlled = checked !== undefined;
  const effectiveChecked = isControlled ? checked : internalChecked;

  const handleClick = () => {
    if (disabled) return;
    const newChecked = !effectiveChecked;

    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    onCheckedChange?.(newChecked);
  };

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={effectiveChecked}
      disabled={disabled}
      onClick={handleClick}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${effectiveChecked ? 'bg-orange-600' : 'bg-gray-200'}
        ${className}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${effectiveChecked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
}

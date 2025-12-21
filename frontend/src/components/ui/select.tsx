import React, { createContext, useContext, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export function Select({ children, value, defaultValue, onValueChange, name, disabled = false, className = '' }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');

  const isControlled = value !== undefined;
  const effectiveValue = isControlled ? value : internalValue;

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <SelectContext.Provider value={{ value: effectiveValue || '', onValueChange: handleValueChange, open, setOpen }}>
      <div className={`relative ${className}`}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className = '' }: SelectTriggerProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectTrigger must be used within Select');

  const { open, setOpen } = context;

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 flex items-center justify-between ${className}`}
    >
      {children}
      <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  );
}

export function SelectValue({ placeholder = 'Selecione...', className = '' }: SelectValueProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectValue must be used within Select');

  const { value } = context;

  return (
    <span className={`text-left ${value ? 'text-gray-900' : 'text-gray-500'} ${className}`}>
      {value || placeholder}
    </span>
  );
}

export function SelectContent({ children, className = '' }: SelectContentProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectContent must be used within Select');

  const { open, setOpen } = context;

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      <div className={`absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto ${className}`}>
        {children}
      </div>
    </>
  );
}

export function SelectItem({ value, children, disabled = false }: SelectItemProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectItem must be used within Select');

  const { onValueChange, setOpen } = context;

  const handleClick = () => {
    if (!disabled) {
      onValueChange(value);
      setOpen(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'
        }`}
    >
      {children}
    </div>
  );
}

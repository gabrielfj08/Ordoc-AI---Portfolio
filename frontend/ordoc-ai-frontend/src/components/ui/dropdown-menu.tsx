import React, { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface DropdownMenuContentProps {
  align?: 'start' | 'center' | 'end';
  children: React.ReactNode;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isOpen, setIsOpen } as any);
        }
        return child;
      })}
    </div>
  );
}

export function DropdownMenuTrigger({ 
  asChild, 
  children, 
  ...props 
}: DropdownMenuTriggerProps & { isOpen?: boolean; setIsOpen?: (open: boolean) => void }) {
  const { isOpen, setIsOpen } = props as any;
  
  const handleClick = () => {
    setIsOpen?.(!isOpen);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick } as any);
  }

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ 
  align = 'end', 
  children, 
  ...props 
}: DropdownMenuContentProps & { isOpen?: boolean }) {
  const { isOpen } = props as any;
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom');

  useEffect(() => {
    if (isOpen && contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Se não tiver espaço suficiente abaixo (menos de 200px), abrir para cima
      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setPosition('top');
      } else {
        setPosition('bottom');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0',
  };

  const positionClasses = position === 'top' 
    ? 'bottom-full mb-1' 
    : 'top-full mt-1';

  return (
    <div 
      ref={contentRef}
      className={`absolute ${positionClasses} ${alignmentClasses[align]} z-50 min-w-[12rem] max-h-[300px] overflow-y-auto rounded-md border bg-white p-1 shadow-lg`}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, onClick }: DropdownMenuItemProps) {
  return (
    <button
      className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-gray-200" />;
}

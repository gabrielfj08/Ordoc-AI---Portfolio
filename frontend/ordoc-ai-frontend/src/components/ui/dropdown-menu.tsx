import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
  const triggerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isOpen, setIsOpen, triggerRef } as any);
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
}: DropdownMenuTriggerProps & { isOpen?: boolean; setIsOpen?: (open: boolean) => void; triggerRef?: React.RefObject<HTMLElement> }) {
  const { isOpen, setIsOpen, triggerRef } = props as any;
  
  const handleClick = () => {
    setIsOpen?.(!isOpen);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick, ref: triggerRef } as any);
  }

  return (
    <button onClick={handleClick} ref={triggerRef}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ 
  align = 'end', 
  children, 
  ...props 
}: DropdownMenuContentProps & { isOpen?: boolean; triggerRef?: React.RefObject<HTMLElement> }) {
  const { isOpen, triggerRef } = props as any;
  const contentRef = useRef<HTMLDivElement>(null);
  const [styles, setStyles] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (isOpen && triggerRef?.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      
      let top = triggerRect.bottom + 4; // 4px abaixo
      
      // Se não tiver espaço suficiente abaixo, abrir para cima
      if (spaceBelow < 200 && spaceAbove > 200) {
        top = triggerRect.top - contentRect.height - 4;
      }
      
      let left = triggerRect.right - 200; // 200px é a largura aproximada do menu
      
      // Alinhamentos
      if (align === 'start') {
        left = triggerRect.left;
      } else if (align === 'center') {
        left = triggerRect.left + (triggerRect.width / 2) - 100;
      }
      
      // Garantir que não saia da tela
      if (left < 10) left = 10;
      if (left + 200 > window.innerWidth) left = window.innerWidth - 210;
      
      setStyles({
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 9999,
      });
    }
  }, [isOpen, align, triggerRef]);

  if (!isOpen || typeof window === 'undefined') return null;

  return createPortal(
    <div 
      ref={contentRef}
      style={styles}
      className="min-w-[12rem] max-w-[16rem] max-h-[300px] overflow-y-auto rounded-md border bg-white p-1 shadow-xl"
    >
      {children}
    </div>,
    document.body
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

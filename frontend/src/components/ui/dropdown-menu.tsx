import React, { useState, useRef, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

// Fallback for cn if not available
const cls = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// Create Context
const DropdownContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  triggerRef: React.RefObject<any>;
} | null>(null);

interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string; // Added
}

interface DropdownMenuContentProps {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left'; // Added prop
  sideOffset?: number; // Added prop
  children: React.ReactNode;
  className?: string; // Added
  onMouseDown?: (e: React.MouseEvent) => void;
}

interface DropdownMenuItemProps {
  asChild?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  className?: string; // Added
}

export function DropdownMenu({ children, open, onOpenChange }: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<any>(null);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;
  const setIsOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    }
    if (!isControlled) {
      setUncontrolledOpen(value);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onOpenChange, isControlled, setIsOpen, triggerRef]);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      <div className="relative inline-block" ref={dropdownRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  asChild,
  children,
  className,
  ...props
}: DropdownMenuTriggerProps) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");
  const { isOpen, setIsOpen, triggerRef } = context;

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick, ref: triggerRef } as any);
  }

  return (
    <button onClick={handleClick} ref={triggerRef} className={className}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  align = 'end',
  side = 'bottom',
  sideOffset = 4,
  children,
  className,
  ...props
}: DropdownMenuContentProps) {
  const context = useContext(DropdownContext);
  if (!context) return null; // Or throw
  const { isOpen, triggerRef } = context;

  const contentRef = useRef<HTMLDivElement>(null);
  // Start hidden to avoid FOUC (Flash of Unpositioned Content)
  const [styles, setStyles] = useState<React.CSSProperties>({ opacity: 0, position: 'fixed', top: 0, left: 0 });

  // Use useLayoutEffect to measure and position before paint
  React.useLayoutEffect(() => {
    if (isOpen && triggerRef?.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      // Basic positioning support
      if (side === 'bottom') {
        top = triggerRect.bottom + sideOffset;
        if (align === 'start') left = triggerRect.left;
        else if (align === 'center') left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2);
        else left = triggerRect.right - contentRect.width;
      } else if (side === 'right') {
        top = triggerRect.top;
        left = triggerRect.right + sideOffset;
      } else if (side === 'top') {
        top = triggerRect.top - contentRect.height - sideOffset;
        if (align === 'start') left = triggerRect.left;
        else if (align === 'center') left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2);
        else left = triggerRect.right - contentRect.width;
      }

      // Keep in viewport logic...
      if (left < 10) left = 10;
      // Note: window might not be available in SSR, but this effect runs on client.
      if (typeof window !== 'undefined') {
        if (left + contentRect.width > window.innerWidth) left = window.innerWidth - contentRect.width - 10;

        // Simple bottom overflow check
        if (top + contentRect.height > window.innerHeight) {
          // If flipping to top is better? For now just clamp or let it be.
          // A robust implementation would flip side.
          // Let's at least try to flip if side was bottom
          if (side === 'bottom' && (triggerRect.top - contentRect.height > 0)) {
            top = triggerRect.top - contentRect.height - sideOffset;
          }
        }
      }

      setStyles({
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 9999,
        opacity: 1, // Reveal
      });
    }
  }, [isOpen, align, side, sideOffset, triggerRef]);

  if (!isOpen || typeof window === 'undefined') return null;

  return createPortal(
    <div
      ref={contentRef}
      style={styles}
      className={cls("min-w-[12rem] bg-white rounded-md border shadow-md p-1", className)}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  );
}

export function DropdownMenuItem({ children, onClick, className, asChild }: DropdownMenuItemProps) {
  const context = useContext(DropdownContext);
  const setIsOpen = context?.setIsOpen;

  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cls("relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100", className)}
      onClick={(e: React.MouseEvent) => {
        onClick?.(e);
        setIsOpen?.(false); // Close automatically
      }}
    >
      {children}
    </Comp>
  );
}

export function DropdownMenuLabel({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cls("px-2 py-1.5 text-sm font-semibold", className)}>{children}</div>;
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-gray-200" />;
}

export function DropdownMenuShortcut({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span
      className={cls("ml-auto text-xs tracking-widest text-slate-500", className)}
    >
      {children}
    </span>
  )
}

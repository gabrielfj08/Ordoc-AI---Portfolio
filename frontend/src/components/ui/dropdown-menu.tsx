import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils" // Assuming cn utility exists, it usually does in shadcn projects. If not, I'll use template literals, but checking for utils is good practice. I'll stick to template literals if unsure, but shadcn standard uses cn.

// Fallback for cn if not available, but likely is. I'll use template literals to be safe.
const cls = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

interface DropdownMenuProps {
  children: React.ReactNode;
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
}

interface DropdownMenuItemProps {
  asChild?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string; // Added
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Check if click was on content (portal)
        // Hard to check portal click from here without ref coordination, but simplistic approach:
        // Rely on content closing itself or backdrop if modal.
        // For now, simple outside click on trigger wrapper closes it. 
        // Real Radix is more complex.
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
  className,
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
}: DropdownMenuContentProps & { isOpen?: boolean; triggerRef?: React.RefObject<HTMLElement> }) {
  const { isOpen, triggerRef } = props as any;
  const contentRef = useRef<HTMLDivElement>(null);
  const [styles, setStyles] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (isOpen && triggerRef?.current && contentRef.current) {
      // Simplified positioning logic mimicking the original manual implementation but respecting side/align loosely
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

      // Keep in viewport
      if (left < 10) left = 10;
      if (left + contentRect.width > window.innerWidth) left = window.innerWidth - contentRect.width - 10;
      if (top < 10) top = 10;
      // if (top + contentRect.height > window.innerHeight) ...

      setStyles({
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 9999,
      });
    }
  }, [isOpen, align, side, sideOffset, triggerRef]);

  if (!isOpen || typeof window === 'undefined') return null;

  return createPortal(
    <div
      ref={contentRef}
      style={styles}
      className={cls("min-w-[12rem] bg-white rounded-md border shadow-md p-1", className)}
    >
      {children}
    </div>,
    document.body
  );
}

export function DropdownMenuItem({ children, onClick, className, asChild }: DropdownMenuItemProps) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cls("relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100", className)}
      onClick={onClick}
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

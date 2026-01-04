import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface DroppableProps {
    id: string;
    data?: any;
    children: React.ReactNode;
    className?: string;
    accepts?: string[]; // Optional type filtering
    activeClassName?: string;
}

export function Droppable({ id, data, children, className, activeClassName }: DroppableProps) {
    const { setNodeRef, isOver } = useDroppable({
        id,
        data,
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                className,
                isOver && (activeClassName || "bg-accent/50 ring-2 ring-primary ring-inset")
            )}
        >
            {children}
        </div>
    );
}

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableProps {
    id: string;
    data?: any;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

export function Draggable({ id, data, children, className, disabled = false }: DraggableProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
        data,
        disabled,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 'auto', // Ensure visibility during drag
        cursor: disabled ? 'default' : (isDragging ? 'grabbing' : 'grab'),
        touchAction: 'none', // Critical for pointer sensors
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={className}>
            {children}
        </div>
    );
}

"use client";

import { useState, useCallback } from "react";

export const useDragAndDrop = (onMoveItem: (draggedId: string, targetId: string) => void) => {
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dropTargetId, setDropTargetId] = useState<string | null>(null);

    // Início do arraste
    const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.setData("text/plain", id);
        e.dataTransfer.effectAllowed = "move";

        // Custom ghost image
        const ghost = document.createElement('div');
        ghost.classList.add('bg-blue-600', 'text-white', 'px-3', 'py-1', 'rounded-full', 'text-xs', 'fixed', 'top-[-100px]', 'z-[9999]', 'font-medium', 'shadow-md');
        ghost.innerText = "Movendo item...";
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 0, 0);
        setTimeout(() => {
            if (document.body.contains(ghost)) {
                document.body.removeChild(ghost);
            }
        }, 0);
    }, []);

    // Sobre o alvo (Validação)
    const handleDragOver = useCallback((e: React.DragEvent, targetId: string, isFolder: boolean) => {
        e.preventDefault();
        e.stopPropagation();

        // Regra de Ouro: Não soltar em si mesmo e apenas em pastas
        // Note: We need to access the current draggedId from state or closure. 
        // Since useCallback depends on draggedId, it will update.
        if (isFolder && targetId !== draggedId) {
            setDropTargetId(targetId);
            e.dataTransfer.dropEffect = "move";
        }
    }, [draggedId]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDropTargetId(null);
    }, []);

    // Soltar (Execução)
    const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (draggedId && draggedId !== targetId) {
            onMoveItem(draggedId, targetId);
        }
        setDropTargetId(null);
        setDraggedId(null);
    }, [draggedId, onMoveItem]);

    return {
        draggedId,
        dropTargetId,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop
    };
};

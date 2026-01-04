
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { trashApi } from '../services/documents-api'; // Verify import path

interface DocumentsState {
    // Navigation
    currentFolderId: string | null;

    // Selection
    selectedItemId: string | null;
    selectedItemType: 'document' | 'folder' | null;
    selectedItemIds: string[]; // Added for multi-selection

    // UI Configuration
    viewMode: 'grid' | 'list';
    rightPanelTab: 'details' | 'activity' | 'activities';
    rightPanelOpen: boolean;

    // Drag & Drop
    draggedItemIds: string[];
    dropTargetId: string | null;
    dropTargetType: 'folder' | 'trash' | null;

    // Modals
    trashConfirmModal: {
        isOpen: boolean;
        items: Array<{ id: string; name: string; type: 'document' | 'folder' }>;
    };
    permanentDeleteModal: {
        isOpen: boolean;
        items: Array<{ id: string; name: string; type: 'document' | 'folder' }>;
    };
    emptyTrashModal: {
        isOpen: boolean;
        stats: { totalItems: number; totalSize: string };
    };

    // Actions
    setCurrentFolder: (folderId: string | null) => void;
    setSelectedItem: (id: string | null, type: 'document' | 'folder' | null) => void;
    setSelection: (ids: string[]) => void; // Multi-selection action
    setViewMode: (mode: 'grid' | 'list') => void;
    setRightPanelTab: (tab: 'details' | 'activity' | 'activities') => void;
    toggleRightPanel: () => void;

    // DnD Actions
    setDraggedItems: (ids: string[]) => void;
    setDropTarget: (id: string | null, type: 'folder' | 'trash' | null) => void;
    clearDragState: () => void;

    // Modal Actions
    openTrashConfirmModal: (items: Array<{ id: string; name: string; type: 'document' | 'folder' }>) => void;
    closeTrashConfirmModal: () => void;
    openPermanentDeleteModal: (items: Array<{ id: string; name: string; type: 'document' | 'folder' }>) => void;
    closePermanentDeleteModal: () => void;
    openEmptyTrashModal: () => void;
    closeEmptyTrashModal: () => void;
}

export const useDocumentsStore = create<DocumentsState>()(
    devtools(
        (set, get) => ({
            currentFolderId: null,
            selectedItemId: null,
            selectedItemType: null,
            selectedItemIds: [],
            viewMode: 'grid',
            rightPanelTab: 'details',
            rightPanelOpen: true,

            // DnD Defaults
            draggedItemIds: [],
            dropTargetId: null,
            dropTargetType: null,

            // Modals Defaults
            trashConfirmModal: { isOpen: false, items: [] },
            permanentDeleteModal: { isOpen: false, items: [] },
            emptyTrashModal: { isOpen: false, stats: { totalItems: 0, totalSize: '0 B' } },

            setCurrentFolder: (folderId) => set({ currentFolderId: folderId }),

            setSelectedItem: (id, type) => set({
                selectedItemId: id,
                selectedItemType: type,
                selectedItemIds: id ? [id] : [],
                rightPanelOpen: id ? true : false
            }),

            setSelection: (ids) => set({ selectedItemIds: ids }),

            setViewMode: (mode) => set({ viewMode: mode }),

            setRightPanelTab: (tab) => set({ rightPanelTab: tab }),

            toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),

            // DnD Implementation
            setDraggedItems: (ids) => set({ draggedItemIds: ids }),
            setDropTarget: (id, type) => set({ dropTargetId: id, dropTargetType: type }),
            clearDragState: () => set({
                draggedItemIds: [],
                dropTargetId: null,
                dropTargetType: null,
            }),

            // Modal Implementation
            openTrashConfirmModal: (items) => set({
                trashConfirmModal: { isOpen: true, items }
            }),
            closeTrashConfirmModal: () => set({
                trashConfirmModal: { isOpen: false, items: [] }
            }),

            openPermanentDeleteModal: (items) => set({
                permanentDeleteModal: { isOpen: true, items }
            }),
            closePermanentDeleteModal: () => set({
                permanentDeleteModal: { isOpen: false, items: [] }
            }),

            openEmptyTrashModal: async () => {
                try {
                    // Fetch stats - mapping list output to stats
                    const response = await trashApi.list({ limit: 1 } as any);
                    const stats = response.stats || { total_items: 0, total_size_formatted: '0 B' };
                    set({
                        emptyTrashModal: {
                            isOpen: true,
                            stats: {
                                totalItems: stats.total_items,
                                totalSize: stats.total_size_formatted || '0 B'
                            }
                        }
                    });
                } catch (error) {
                    console.error("Failed to fetch trash stats", error);
                    // Open anyway with 0
                    set({
                        emptyTrashModal: {
                            isOpen: true,
                            stats: { totalItems: 0, totalSize: '?' }
                        }
                    });
                }
            },
            closeEmptyTrashModal: () => set({
                emptyTrashModal: { isOpen: false, stats: { totalItems: 0, totalSize: '0 B' } }
            }),
        }),
        { name: 'DocumentsStore' }
    )
)

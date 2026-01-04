import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDocumentsStore } from "@/stores/documentsStore"
import { documentsApi, directoriesApi } from "@/services/documents-api"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner" // Assuming sonner is used for toasts based on user files
// If sonner not available, use-toast.ts is there. Let's check imports. User used toast in other files.

export function TrashConfirmModal() {
    const { trashConfirmModal, closeTrashConfirmModal, clearDragState } = useDocumentsStore()
    const queryClient = useQueryClient()

    const handleConfirm = async () => {
        try {
            const ids = trashConfirmModal.items.map(i => i.id)
            if (ids.length === 0) return

            const docIds = trashConfirmModal.items.filter(i => i.type === 'document' || !i.type).map(i => i.id)
            const folderIds = trashConfirmModal.items.filter(i => i.type === 'folder').map(i => i.id)

            // Delete Documents
            if (docIds.length === 1) {
                await documentsApi.trash(docIds[0])
            } else if (docIds.length > 0) {
                await documentsApi.bulkTrash(docIds)
            }

            // Delete Folders (Loop for now as we lack bulk API for folders)
            await Promise.all(folderIds.map(id => directoriesApi.delete(id)))

            toast.success(`${ids.length} item(s) movido(s) para a lixeira`)

            // Invalidate queries
            queryClient.invalidateQueries({ queryKey: ['documents'] })
            queryClient.invalidateQueries({ queryKey: ['directories'] })
            queryClient.invalidateQueries({ queryKey: ['trash'] })

            closeTrashConfirmModal()
            clearDragState()

        } catch (error) {
            console.error("Failed to trash items", error)
            toast.error("Erro ao mover itens para a lixeira")
        }
    }

    return (
        <AlertDialog open={trashConfirmModal.isOpen} onOpenChange={(open) => !open && closeTrashConfirmModal()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Mover para a Lixeira?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {trashConfirmModal.items.length === 1
                            ? `Você tem certeza que deseja mover "${trashConfirmModal.items[0].name}" para a lixeira?`
                            : `Você tem certeza que deseja mover ${trashConfirmModal.items.length} itens para a lixeira?`
                        }
                        <br />
                        Os itens podem ser restaurados da lixeira por 30 dias.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Mover para Lixeira
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

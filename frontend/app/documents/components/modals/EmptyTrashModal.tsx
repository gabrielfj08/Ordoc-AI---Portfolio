import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDocumentsStore } from "@/stores/documentsStore"
import { trashApi } from "@/services/documents-api"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loader2, Trash2 } from "lucide-react"

export function EmptyTrashModal() {
    const { emptyTrashModal, closeEmptyTrashModal } = useDocumentsStore()
    const queryClient = useQueryClient()
    const [confirmation, setConfirmation] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)

    // Reset confirmation when modal opens
    useEffect(() => {
        if (emptyTrashModal.isOpen) {
            setConfirmation("")
        }
    }, [emptyTrashModal.isOpen])

    const handleConfirm = async () => {
        if (confirmation !== "ESVAZIAR LIXEIRA") return

        setIsDeleting(true)
        try {
            await trashApi.empty()

            toast.success("Lixeira esvaziada com sucesso")

            queryClient.invalidateQueries({ queryKey: ['trash'] })
            queryClient.invalidateQueries({ queryKey: ['documents'] }) // Just in case

            closeEmptyTrashModal()
            setConfirmation("")

        } catch (error) {
            console.error("Failed to empty trash", error)
            toast.error("Erro ao esvaziar a lixeira")
        } finally {
            setIsDeleting(false)
        }
    }

    const isConfirmDisabled = confirmation !== "ESVAZIAR LIXEIRA" || isDeleting

    return (
        <Dialog open={emptyTrashModal.isOpen} onOpenChange={(open) => {
            if (!open) {
                closeEmptyTrashModal()
                setConfirmation("")
            }
        }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <Trash2 className="h-5 w-5" />
                        Esvaziar Lixeira
                    </DialogTitle>
                    <DialogDescription>
                        Todos os itens na lixeira serão apagados permanentemente. Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-muted/30 p-4 rounded-lg flex flex-col gap-2 border">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total de Itens:</span>
                        <span className="font-medium">{emptyTrashModal.stats?.totalItems || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tamanho Total:</span>
                        <span className="font-medium">{emptyTrashModal.stats?.totalSize || '0 B'}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 py-4">
                    <p className="text-sm text-muted-foreground">
                        Para confirmar, digite <span className="font-bold text-foreground">ESVAZIAR LIXEIRA</span> abaixo:
                    </p>
                    <Input
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                        placeholder="ESVAZIAR LIXEIRA"
                        className="bg-muted/50"
                        autoComplete="off"
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={closeEmptyTrashModal} disabled={isDeleting}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="destructive"
                        disabled={isConfirmDisabled}
                    >
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Esvaziar Tudo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

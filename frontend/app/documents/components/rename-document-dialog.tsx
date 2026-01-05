
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { documentsApi, Document } from "@/services/documents-api"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface RenameDocumentDialogProps {
    document: Document | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function RenameDocumentDialog({ document, open, onOpenChange, onSuccess }: RenameDocumentDialogProps) {
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (document) {
            setName(document.name)
        }
    }, [document])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !document) return

        try {
            setLoading(true)
            await documentsApi.update(document.id, { name: name.trim() })
            toast.success("Documento renomeado com sucesso")
            onOpenChange(false)
            onSuccess()
        } catch (error) {
            console.error(error)
            toast.error("Erro ao renomear documento")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Renomear Documento</DialogTitle>
                    <DialogDescription>
                        Digite o novo nome para o documento.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="rename-name">Nome</Label>
                            <Input
                                id="rename-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading || !name.trim() || name === document?.name}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

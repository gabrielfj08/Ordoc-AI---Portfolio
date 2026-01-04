
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { directoriesApi } from '@/services/documents-api'
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface CreateFolderDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
    currentDirectory?: string
}

export function CreateFolderDialog({ open, onOpenChange, onSuccess, currentDirectory }: CreateFolderDialogProps) {
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        try {
            setLoading(true)
            await directoriesApi.create({
                name: name.trim(),
                parent: currentDirectory || undefined
            })
            toast.success("Pasta criada com sucesso")
            setName("")
            onOpenChange(false)
            onSuccess()
        } catch (error) {
            console.error(error)
            toast.error("Erro ao criar pasta")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nova Pasta</DialogTitle>
                    <DialogDescription>
                        Crie uma nova pasta para organizar seus documentos.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome da pasta</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: Contratos 2024"
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading || !name.trim()}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Criar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

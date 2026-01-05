
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { directoriesApi, Directory } from "@/services/documents-api"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface RenameFolderDialogProps {
    directory: Directory | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function RenameFolderDialog({ directory, open, onOpenChange, onSuccess }: RenameFolderDialogProps) {
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (directory) {
            setName(directory.name)
        }
    }, [directory])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !directory) return

        try {
            setLoading(true)
            await directoriesApi.update(directory.id, { name: name.trim() })
            toast.success("Pasta renomeada com sucesso")
            onOpenChange(false)
            onSuccess()
        } catch (error) {
            console.error(error)
            toast.error("Erro ao renomear pasta")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Renomear Pasta</DialogTitle>
                    <DialogDescription>
                        Digite o novo nome para a pasta.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="rename-folder-name">Nome</Label>
                            <Input
                                id="rename-folder-name"
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
                        <Button type="submit" disabled={loading || !name.trim() || name === directory?.name}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

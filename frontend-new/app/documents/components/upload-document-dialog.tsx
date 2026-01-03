
import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { documentsApi } from "@/services/documents-api"
import { Loader2, Upload, X, FileText } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface UploadDocumentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
    currentDirectory?: string
}

export function UploadDocumentDialog({ open, onOpenChange, onSuccess, currentDirectory }: UploadDocumentDialogProps) {
    const [file, setFile] = useState<File | null>(null)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            setName(selectedFile.name)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0]
            setFile(selectedFile)
            setName(selectedFile.name)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return

        try {
            setLoading(true)
            await documentsApi.upload({
                file,
                name: name.trim() || file.name,
                description: description.trim(),
                directory: currentDirectory
            })
            toast.success("Documento enviado com sucesso")
            setFile(null)
            setName("")
            setDescription("")
            onOpenChange(false)
            onSuccess()
        } catch (error) {
            console.error(error)
            toast.error("Erro ao enviar documento")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Upload de Documento</DialogTitle>
                    <DialogDescription>
                        Envie arquivos PDF, Word ou imagens para o Ordoc.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {!file ? (
                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors",
                                    "hover:bg-muted/50 hover:border-primary/50"
                                )}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                            >
                                <div className="p-3 bg-primary/10 rounded-full mb-3">
                                    <Upload className="size-6 text-primary" />
                                </div>
                                <div className="text-sm font-medium mb-1">Clique para selecionar ou arraste</div>
                                <div className="text-xs text-muted-foreground">PDF, DOCX, JPG até 50MB</div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                                />
                            </div>
                        ) : (
                            <div className="border rounded-lg p-3 flex items-start gap-3 bg-muted/30">
                                <div className="p-2 bg-background rounded border">
                                    <FileText className="size-6 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                    onClick={() => setFile(null)}
                                >
                                    <X className="size-4" />
                                </Button>
                            </div>
                        )}

                        {file && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="doc-name">Nome do arquivo</Label>
                                    <Input
                                        id="doc-name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="doc-desc">Descrição (opcional)</Label>
                                    <Textarea
                                        id="doc-desc"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Adicione detalhes sobre este documento..."
                                        className="resize-none"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading || !file}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enviar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

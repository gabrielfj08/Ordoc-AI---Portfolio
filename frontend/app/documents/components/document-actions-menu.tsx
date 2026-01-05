
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
    MoreVertical,
    Eye,
    Download,
    Star,
    Pencil,
    Trash2,
    Share2,
    RefreshCcw
} from "lucide-react"
import { Document, documentsApi } from "@/services/documents-api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useDocumentsStore } from "@/stores/documentsStore"

interface DocumentActionsMenuProps {
    document: Document
    onRename: (doc: Document) => void
    onRefresh: () => void
}

export function DocumentActionsMenu({ document, onRename, onRefresh }: DocumentActionsMenuProps) {
    const router = useRouter()

    const handleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            if (document.is_favorite) {
                await documentsApi.unfavorite(document.id)
                toast.success("Removido dos favoritos")
            } else {
                await documentsApi.favorite(document.id)
                toast.success("Adicionado aos favoritos")
            }
            onRefresh()
        } catch (error) {
            toast.error("Erro ao atualizar favoritos")
        }
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()

        // Confirmação do usuário
        const confirmed = window.confirm(
            `Tem certeza que deseja mover "${document.name}" para a lixeira?\n\n` +
            `Você poderá recuperá-lo da lixeira em até 30 dias.`
        )

        if (!confirmed) return

        try {
            await documentsApi.trash(document.id)
            toast.success("Documento movido para lixeira")
            onRefresh()
        } catch (error: any) {
            console.error('Erro ao mover para lixeira:', error)
            if (error.response?.status === 400) {
                toast.error(error.response.data.detail || "Erro ao mover documento para lixeira")
            } else if (error.response?.status === 403) {
                toast.error("Você não tem permissão para excluir este documento")
            } else {
                toast.error("Erro ao mover documento para lixeira")
            }
        }
    }

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation()
        // Use the file URL directly or API download endpoint
        if (document.file) {
            window.open(document.file, '_blank')
        } else {
            toast.error("Arquivo não disponível")
        }
    }

    const { openPermanentDeleteModal } = useDocumentsStore()

    const handleRestore = async (e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            await documentsApi.restore(document.id)
            toast.success("Documento restaurado")
            onRefresh()
        } catch (error) {
            toast.error("Erro ao restaurar documento")
        }
    }

    const handlePermanentDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        openPermanentDeleteModal([{ id: document.id, name: document.name, type: 'document' }])
    }

    if (document.deleted_at) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="size-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleRestore}>
                        <RefreshCcw className="size-4 mr-2" />
                        Restaurar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handlePermanentDelete} className="text-red-600">
                        <Trash2 className="size-4 mr-2" />
                        Excluir permanentemente
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="size-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => router.push(`/documents/${document.id}`)}>
                    <Eye className="size-4 mr-2" />
                    Abrir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>
                    <Download className="size-4 mr-2" />
                    Baixar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleFavorite}>
                    <Star className={`size-4 mr-2 ${document.is_favorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    {document.is_favorite ? "Remover favorito" : "Favoritar"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onRename(document); }}>
                    <Pencil className="size-4 mr-2" />
                    Renomear
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Share2 className="size-4 mr-2" />
                    Compartilhar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="size-4 mr-2" />
                    Mover para lixeira
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

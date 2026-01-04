
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
    MoreVertical,
    Download,
    Pencil,
    Trash2,
    Share2,
    FolderInput,
    Info,
    Sparkles,
    Move,
    Palette
} from "lucide-react"
import { Directory, documentsApi } from "@/services/documents-api"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface FolderActionsMenuProps {
    directory: Directory
    onRename?: (dir: Directory) => void
    onDelete?: (dir: Directory) => void
    onRefresh: () => void
}

export function FolderActionsMenu({ directory, onRename, onDelete, onRefresh }: FolderActionsMenuProps) {

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()

        // Confirmação do usuário
        const confirmed = window.confirm(
            `Tem certeza que deseja mover "${directory.name}" para a lixeira?\n\n` +
            `Esta ação irá mover TODOS os documentos e subpastas contidos nela.\n\n` +
            `Você poderá recuperá-los da lixeira em até 30 dias.`
        )

        if (!confirmed) return

        try {
            await documentsApi.deleteDirectory(directory.id)
            toast.success(`Pasta "${directory.name}" movida para a lixeira`)
            onRefresh()
        } catch (error: any) {
            console.error('Erro ao excluir pasta:', error)

            if (error.response?.status === 400) {
                toast.error(error.response.data.detail || "Erro ao excluir pasta")
            } else if (error.response?.status === 403) {
                toast.error("Você não tem permissão para excluir esta pasta")
            } else {
                toast.error("Erro ao excluir pasta. Tente novamente.")
            }
        }
    }

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation()
        toast.info("Funcionalidade em desenvolvimento. Disponível em breve!")
    }

    const handleSummarize = (e: React.MouseEvent) => {
        e.stopPropagation()
        toast.info("Funcionalidade em desenvolvimento. Disponível em breve!")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="size-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="size-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                {/* Funcionalidades implementadas */}
                <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    if (onRename) onRename(directory);
                }}>
                    <Pencil className="size-4 mr-2" />
                    Renomear
                    <span className="ml-auto text-xs text-muted-foreground">Ctrl+Alt+E</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Funcionalidades em desenvolvimento */}
                <DropdownMenuLabel className="text-xs text-muted-foreground">Em desenvolvimento</DropdownMenuLabel>

                <DropdownMenuItem disabled onClick={handleDownload} className="opacity-60">
                    <Download className="size-4 mr-2" />
                    Baixar
                    <Badge variant="outline" className="ml-auto text-[10px] h-4 px-1">
                        Em breve
                    </Badge>
                </DropdownMenuItem>

                <DropdownMenuItem disabled onClick={handleSummarize} className="opacity-60">
                    <Sparkles className="size-4 mr-2" />
                    Resuma esta pasta
                    <Badge variant="outline" className="ml-auto text-[10px] h-4 px-1">
                        Em breve
                    </Badge>
                </DropdownMenuItem>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger disabled className="opacity-60">
                        <Share2 className="size-4 mr-2" />
                        Compartilhar
                        <Badge variant="outline" className="ml-1 text-[10px] h-4 px-1">
                            Em breve
                        </Badge>
                    </DropdownMenuSubTrigger>
                </DropdownMenuSub>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger disabled className="opacity-60">
                        <FolderInput className="size-4 mr-2" />
                        Organizar
                        <Badge variant="outline" className="ml-1 text-[10px] h-4 px-1">
                            Em breve
                        </Badge>
                    </DropdownMenuSubTrigger>
                </DropdownMenuSub>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger disabled className="opacity-60">
                        <Info className="size-4 mr-2" />
                        Informações
                        <Badge variant="outline" className="ml-1 text-[10px] h-4 px-1">
                            Em breve
                        </Badge>
                    </DropdownMenuSubTrigger>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                    <Trash2 className="size-4 mr-2" />
                    Mover para a lixeira
                    <span className="ml-auto text-xs text-muted-foreground/50">Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

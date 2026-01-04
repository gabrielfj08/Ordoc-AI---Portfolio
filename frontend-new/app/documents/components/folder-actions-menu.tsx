
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
        // Implementação futura de exclusão de diretório na API
        // Por enquanto apenas emite evento ou toast
        if (onDelete) {
            onDelete(directory)
        } else {
            toast.info("Funcionalidade de exclusão de pasta em desenvolvimento")
        }
    }

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation()
        toast.info("Preparando download do pacote...")
        // Implementar lógica de download de pasta (zip)
    }

    const handleSummarize = (e: React.MouseEvent) => {
        e.stopPropagation()
        toast.info("IA analisando conteúdo da pasta...")
        // Trigger AI summary
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="size-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="size-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={handleDownload}>
                    <Download className="size-4 mr-2" />
                    Baixar
                </DropdownMenuItem>

                <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    if (onRename) onRename(directory);
                }}>
                    <Pencil className="size-4 mr-2" />
                    Renomear
                    <span className="ml-auto text-xs text-muted-foreground">Ctrl+Alt+E</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleSummarize} className="text-primary focus:text-primary font-medium">
                    <Sparkles className="size-4 mr-2" />
                    Resuma esta pasta
                    <Badge variant="secondary" className="ml-auto text-[10px] h-4 px-1 bg-blue-100 text-blue-700 hover:bg-blue-100">
                        Novo
                    </Badge>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Share2 className="size-4 mr-2" />
                        Compartilhar
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem>Copiar link</DropdownMenuItem>
                        <DropdownMenuItem>Gerenciar acesso</DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <FolderInput className="size-4 mr-2" />
                        Organizar
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem>
                            <Move className="size-4 mr-2" />
                            Mover
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Palette className="size-4 mr-2" />
                            Alterar cor
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Info className="size-4 mr-2" />
                        Informações da pasta
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem>Atividade</DropdownMenuItem>
                        <DropdownMenuItem>Detalhes</DropdownMenuItem>
                    </DropdownMenuSubContent>
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

import React from 'react';
import { FileText, MoreVertical, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface DocumentCardProps {
    title: string;
    type: string;
    size?: string;
    updatedAt: string; // ISO string ou formatted
    sharedBy?: string; // If present, displays shared tag
    suggested?: boolean; // IA sugere este documento
    suggestionReason?: string; // Motivo da sugestão
    relevanceScore?: number;
    onClick?: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
    title,
    type,
    size = '2 MB',
    updatedAt,
    sharedBy,
    suggested = false,
    suggestionReason,
    relevanceScore,
    onClick
}) => {
    // Format date logic reuse or simplified
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString; // already formatted
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        } catch {
            return dateString;
        }
    };

    const SuggestedBadge = () => {
        if (!suggested) return null;

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Badge variant="secondary" className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 ml-2">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Sugerido
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-xs">{suggestionReason || 'Documento relevante'}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };

    return (
        <div
            className={`group relative flex items-center justify-between p-3 bg-card hover:bg-accent/50 cursor-pointer border ${suggested ? 'border-primary/40 bg-primary/5' : 'border-border'} hover:border-primary/30 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                {/* Icon - Minimalist (no background) */}
                <div className="w-10 h-10 flex items-center justify-center">
                    <FileText className={`w-6 h-6 ${suggested ? 'text-primary' : 'text-orange-600 dark:text-orange-400/90'}`} />
                </div>

                {/* Info */}
                <div className="flex flex-col">
                    <span className="font-semibold text-foreground text-sm flex items-center flex-wrap gap-1">
                        {title}
                        <SuggestedBadge />
                        {sharedBy && (
                            <span className="text-muted-foreground ml-1" title={`Compartilhado por ${sharedBy}`}>
                                <Share2 className="w-3.5 h-3.5 text-blue-500" />
                            </span>
                        )}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className={`uppercase font-medium ${suggested ? 'text-primary' : 'text-orange-600/70'}`}>{type}</span>
                        <span>•</span>
                        <span>{size}</span>
                        <span>•</span>
                        <span>{formatDate(updatedAt)}</span>
                        {relevanceScore !== undefined && relevanceScore > 0 && suggested && (
                            <>
                                <span>•</span>
                                <span className="text-primary font-medium">{relevanceScore}% relevância</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions - Menu Only */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background/80">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Baixar</DropdownMenuItem>
                        <DropdownMenuItem>Compartilhar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

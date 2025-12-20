import React from 'react';
import { FileText, MoreVertical, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentCardProps {
    title: string;
    type: string;
    size?: string;
    updatedAt: string;
    sharedBy?: string; // If present, displays shared tag
    onClick?: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
    title,
    type,
    size = '2 MB',
    updatedAt,
    sharedBy,
    onClick
}) => {
    return (
        <div
            className="group relative flex items-center justify-between p-3 bg-card hover:bg-accent/50 cursor-pointer border border-border hover:border-primary/30 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                {/* Icon - Minimalist (no background) */}
                <div className="w-10 h-10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400/90" />
                </div>

                {/* Info */}
                <div className="flex flex-col">
                    <span className="font-semibold text-foreground text-sm flex items-center gap-2">
                        {title}
                        {sharedBy && (
                            <span className="text-muted-foreground" title={`Compartilhado por ${sharedBy}`}>
                                <Share2 className="w-3.5 h-3.5 text-blue-500" />
                            </span>
                        )}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className="uppercase font-medium text-orange-600/70">{type}</span>
                        <span>•</span>
                        <span>{size}</span>
                        <span>•</span>
                        <span>{updatedAt}</span>
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

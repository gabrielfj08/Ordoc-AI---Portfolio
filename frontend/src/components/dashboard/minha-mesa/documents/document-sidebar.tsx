'use client';

import { cn } from '@/lib/utils';
import { Folder, Star, Clock, Share2, FileText, Trash2, LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DocumentView } from '@/hooks/use-document-actions';

interface NavItemProps {
    icon: LucideIcon;
    label: string;
    view: DocumentView;
    active?: boolean;
    badge?: number;
    onClick: () => void;
}

function NavItem({ icon: Icon, label, active, badge, onClick }: NavItemProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full",
                active
                    ? "bg-orange-50 text-orange-600 border-l-3 border-orange-600"
                    : "text-gray-700 hover:bg-gray-100"
            )}
        >
            <Icon className={cn("w-5 h-5", active ? "text-orange-600" : "text-gray-500")} />
            <span className="flex-1 text-left">{label}</span>
            {badge !== undefined && badge > 0 && (
                <Badge className="bg-orange-600 text-white text-xs px-2">
                    {badge}
                </Badge>
            )}
        </button>
    );
}

interface DocumentSidebarProps {
    currentView: DocumentView;
    onViewChange: (view: DocumentView) => void;
    counts?: {
        inbox?: number;
        starred?: number;
        pending?: number;
        shared?: number;
        templates?: number;
        trash?: number;
    };
}

export function DocumentSidebar({ currentView, onViewChange, counts = {} }: DocumentSidebarProps) {
    return (
        <aside className="w-60 bg-gray-50 border-r border-gray-200 flex flex-col">
            <nav className="px-2 py-4 space-y-1">
                <NavItem
                    icon={Folder}
                    label="Meu Drive"
                    view="inbox"
                    active={currentView === 'inbox'}
                    onClick={() => onViewChange('inbox')}
                />
                <NavItem
                    icon={Star}
                    label="Prioridades"
                    view="starred"
                    active={currentView === 'starred'}
                    badge={counts.starred}
                    onClick={() => onViewChange('starred')}
                />
                <NavItem
                    icon={Clock}
                    label="Pendentes"
                    view="pending"
                    active={currentView === 'pending'}
                    badge={counts.pending}
                    onClick={() => onViewChange('pending')}
                />
                <NavItem
                    icon={Share2}
                    label="Compartilhados"
                    view="shared"
                    active={currentView === 'shared'}
                    onClick={() => onViewChange('shared')}
                />
                <NavItem
                    icon={FileText}
                    label="Templates"
                    view="templates"
                    active={currentView === 'templates'}
                    onClick={() => onViewChange('templates')}
                />
                <NavItem
                    icon={Trash2}
                    label="Lixeira"
                    view="trash"
                    active={currentView === 'trash'}
                    onClick={() => onViewChange('trash')}
                />
            </nav>
        </aside>
    );
}

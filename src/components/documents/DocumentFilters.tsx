'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

export interface DocumentFilterOptions {
    fileTypes?: string[];
    tags?: string[];
    status?: string[];
    isArchived?: boolean;
    isFavorited?: boolean;
}

interface DocumentFiltersProps {
    filters: DocumentFilterOptions;
    onFilterChange: (filters: DocumentFilterOptions) => void;
    onClearFilters: () => void;
}

const FILE_TYPES = [
    { value: 'pdf', label: 'PDF' },
    { value: 'doc', label: 'Word' },
    { value: 'xls', label: 'Excel' },
    { value: 'ppt', label: 'PowerPoint' },
    { value: 'jpg', label: 'Imagem' },
    { value: 'zip', label: 'Arquivo' },
];

const STATUS_OPTIONS = [
    { value: 'created', label: 'Criado' },
    { value: 'processed', label: 'Processado' },
    { value: 'failed', label: 'Falhou' },
];

export function DocumentFilters({ filters, onFilterChange, onClearFilters }: DocumentFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    const activeFiltersCount =
        (filters.fileTypes?.length || 0) +
        (filters.tags?.length || 0) +
        (filters.status?.length || 0) +
        (filters.isArchived ? 1 : 0) +
        (filters.isFavorited ? 1 : 0);

    const toggleFileType = (type: string) => {
        const current = filters.fileTypes || [];
        const updated = current.includes(type)
            ? current.filter(t => t !== type)
            : [...current, type];
        onFilterChange({ ...filters, fileTypes: updated });
    };

    const toggleStatus = (status: string) => {
        const current = filters.status || [];
        const updated = current.includes(status)
            ? current.filter(s => s !== status)
            : [...current, status];
        onFilterChange({ ...filters, status: updated });
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                    {activeFiltersCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                        >
                            {activeFiltersCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
                <div className="flex items-center justify-between px-2 py-1.5">
                    <DropdownMenuLabel className="p-0">Filtros</DropdownMenuLabel>
                    {activeFiltersCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearFilters}
                            className="h-auto p-1 text-xs"
                        >
                            <X className="h-3 w-3 mr-1" />
                            Limpar
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />

                {/* Tipo de Arquivo */}
                <div className="px-2 py-2">
                    <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                        Tipo de Arquivo
                    </Label>
                    <div className="space-y-2">
                        {FILE_TYPES.map(type => (
                            <div key={type.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`type-${type.value}`}
                                    checked={filters.fileTypes?.includes(type.value)}
                                    onCheckedChange={() => toggleFileType(type.value)}
                                />
                                <label
                                    htmlFor={`type-${type.value}`}
                                    className="text-sm cursor-pointer"
                                >
                                    {type.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <DropdownMenuSeparator />

                {/* Status */}
                <div className="px-2 py-2">
                    <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                        Status
                    </Label>
                    <div className="space-y-2">
                        {STATUS_OPTIONS.map(status => (
                            <div key={status.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`status-${status.value}`}
                                    checked={filters.status?.includes(status.value)}
                                    onCheckedChange={() => toggleStatus(status.value)}
                                />
                                <label
                                    htmlFor={`status-${status.value}`}
                                    className="text-sm cursor-pointer"
                                >
                                    {status.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <DropdownMenuSeparator />

                {/* Opções Rápidas */}
                <div className="px-2 py-2">
                    <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                        Opções Rápidas
                    </Label>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="favorited"
                                checked={filters.isFavorited || false}
                                onCheckedChange={(checked) =>
                                    onFilterChange({ ...filters, isFavorited: checked as boolean })
                                }
                            />
                            <label htmlFor="favorited" className="text-sm cursor-pointer">
                                Apenas favoritos
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="archived"
                                checked={filters.isArchived || false}
                                onCheckedChange={(checked) =>
                                    onFilterChange({ ...filters, isArchived: checked as boolean })
                                }
                            />
                            <label htmlFor="archived" className="text-sm cursor-pointer">
                                Apenas arquivados
                            </label>
                        </div>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

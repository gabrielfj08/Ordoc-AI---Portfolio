"use client";

import React, { useState } from "react";
import { X, Plus, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface MetadataEditorProps {
    tags?: string[];
    metadata?: Record<string, string>;
    isOpen: boolean;
    onClose: () => void;
    onSave?: (tags: string[], metadata: Record<string, string>) => void;
}

export function MetadataEditor({
    tags: initialTags = [],
    metadata: initialMetadata = {},
    isOpen,
    onClose,
    onSave
}: MetadataEditorProps) {
    const [tags, setTags] = useState<string[]>(initialTags);
    const [newTag, setNewTag] = useState("");
    const [metadata, setMetadata] = useState<Record<string, string>>(initialMetadata);
    const [newKey, setNewKey] = useState("");
    const [newValue, setNewValue] = useState("");

    if (!isOpen) return null;

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const handleAddMetadata = () => {
        if (newKey.trim() && newValue.trim()) {
            setMetadata({ ...metadata, [newKey.trim()]: newValue.trim() });
            setNewKey("");
            setNewValue("");
        }
    };

    const handleRemoveMetadata = (key: string) => {
        const newMetadata = { ...metadata };
        delete newMetadata[key];
        setMetadata(newMetadata);
    };

    const handleSave = () => {
        onSave?.(tags, metadata);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">Editar Metadados</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Gerencie tags e metadados customizados
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Tags Section */}
                    <div>
                        <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <TagIcon size={16} className="text-[#f97316]" />
                            Tags
                        </label>

                        {/* Tag Input */}
                        <div className="flex gap-2 mb-3">
                            <Input
                                placeholder="Nova tag..."
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleAddTag}
                                size="sm"
                                className="bg-[#f97316] hover:bg-[#ea580c] text-white"
                            >
                                <Plus size={16} />
                            </Button>
                        </div>

                        {/* Tag List */}
                        <div className="flex flex-wrap gap-2">
                            {tags.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">Nenhuma tag adicionada</p>
                            ) : (
                                tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="bg-orange-50 text-[#f97316] border-orange-200 hover:bg-orange-100 gap-1 pr-1"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                                        >
                                            <X size={12} />
                                        </button>
                                    </Badge>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Metadata Section */}
                    <div>
                        <label className="text-sm font-semibold text-slate-700 mb-3 block">
                            Metadados Customizados
                        </label>

                        {/* Metadata Input */}
                        <div className="flex gap-2 mb-3">
                            <Input
                                placeholder="Chave"
                                value={newKey}
                                onChange={(e) => setNewKey(e.target.value)}
                                className="flex-1"
                            />
                            <Input
                                placeholder="Valor"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddMetadata()}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleAddMetadata}
                                size="sm"
                                className="bg-[#f97316] hover:bg-[#ea580c] text-white"
                            >
                                <Plus size={16} />
                            </Button>
                        </div>

                        {/* Metadata List */}
                        <div className="space-y-2">
                            {Object.keys(metadata).length === 0 ? (
                                <p className="text-xs text-slate-400 italic">Nenhum metadado customizado</p>
                            ) : (
                                Object.entries(metadata).map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                                    >
                                        <div className="flex-1">
                                            <span className="text-xs font-semibold text-slate-600">{key}:</span>
                                            <span className="text-xs text-slate-700 ml-2">{value}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveMetadata(key)}
                                            className="text-slate-400 hover:text-red-600 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-[#f97316] hover:bg-[#ea580c] text-white"
                    >
                        Salvar Alterações
                    </Button>
                </div>
            </div>
        </div>
    );
}

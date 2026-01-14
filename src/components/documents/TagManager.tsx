'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TagManagerProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
}

export function TagManager({
    tags,
    onTagsChange,
    placeholder = 'Adicionar tag...',
    maxTags = 10
}: TagManagerProps) {
    const [newTag, setNewTag] = useState('');
    const [error, setError] = useState('');

    const addTag = () => {
        const trimmedTag = newTag.trim();

        if (!trimmedTag) {
            return;
        }

        if (tags.length >= maxTags) {
            setError(`Máximo de ${maxTags} tags permitidas`);
            return;
        }

        if (tags.includes(trimmedTag)) {
            setError('Tag já existe');
            return;
        }

        if (trimmedTag.length > 20) {
            setError('Tag muito longa (máx. 20 caracteres)');
            return;
        }

        onTagsChange([...tags, trimmedTag]);
        setNewTag('');
        setError('');
    };

    const removeTag = (tag: string) => {
        onTagsChange(tags.filter(t => t !== tag));
        setError('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <div className="space-y-3">
            {/* Tags existentes */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="px-2 py-1 text-xs flex items-center gap-1"
                        >
                            {tag}
                            <button
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-red-600 transition-colors"
                                type="button"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {/* Input para nova tag */}
            <div className="flex gap-2">
                <Input
                    value={newTag}
                    onChange={(e) => {
                        setNewTag(e.target.value);
                        setError('');
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="flex-1"
                    maxLength={20}
                />
                <Button
                    onClick={addTag}
                    size="sm"
                    type="button"
                    disabled={!newTag.trim() || tags.length >= maxTags}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            {/* Mensagens de erro */}
            {error && (
                <p className="text-xs text-red-600">{error}</p>
            )}

            {/* Contador de tags */}
            <p className="text-xs text-gray-500">
                {tags.length}/{maxTags} tags
            </p>
        </div>
    );
}

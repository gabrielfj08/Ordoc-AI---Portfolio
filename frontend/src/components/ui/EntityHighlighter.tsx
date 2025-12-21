'use client';

/**
 * EntityHighlighter - Highlights extracted entities in text
 */

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './tooltip';
import type { ExtractedEntity } from '@/services/intelligence';

interface EntityHighlighterProps {
    text: string;
    entities: ExtractedEntity[];
    className?: string;
    onEntityClick?: (entity: ExtractedEntity) => void;
}

const entityColors: Record<string, { bg: string; text: string; border: string }> = {
    person: {
        bg: 'bg-blue-100 dark:bg-blue-900/40',
        text: 'text-blue-800 dark:text-blue-200',
        border: 'border-blue-300 dark:border-blue-700',
    },
    organization: {
        bg: 'bg-purple-100 dark:bg-purple-900/40',
        text: 'text-purple-800 dark:text-purple-200',
        border: 'border-purple-300 dark:border-purple-700',
    },
    date: {
        bg: 'bg-green-100 dark:bg-green-900/40',
        text: 'text-green-800 dark:text-green-200',
        border: 'border-green-300 dark:border-green-700',
    },
    value: {
        bg: 'bg-amber-100 dark:bg-amber-900/40',
        text: 'text-amber-800 dark:text-amber-200',
        border: 'border-amber-300 dark:border-amber-700',
    },
    location: {
        bg: 'bg-cyan-100 dark:bg-cyan-900/40',
        text: 'text-cyan-800 dark:text-cyan-200',
        border: 'border-cyan-300 dark:border-cyan-700',
    },
    default: {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-800 dark:text-gray-200',
        border: 'border-gray-300 dark:border-gray-600',
    },
};

const entityLabels: Record<string, string> = {
    person: 'Pessoa',
    organization: 'Organização',
    date: 'Data',
    value: 'Valor',
    location: 'Local',
    amount: 'Quantia',
    clause: 'Cláusula',
    law_reference: 'Lei',
    obligation: 'Obrigação',
    party: 'Parte',
};

export function EntityHighlighter({
    text,
    entities,
    className,
    onEntityClick,
}: EntityHighlighterProps) {
    // Sort entities by start position and merge overlapping
    const sortedEntities = useMemo(() => {
        return [...entities]
            .filter((e) => e.start !== undefined && e.end !== undefined)
            .sort((a, b) => (a.start ?? 0) - (b.start ?? 0));
    }, [entities]);

    // Build highlighted text segments
    const segments = useMemo(() => {
        const result: { text: string; entity?: ExtractedEntity }[] = [];
        let lastEnd = 0;

        for (const entity of sortedEntities) {
            const start = entity.start ?? 0;
            const end = entity.end ?? 0;

            // Skip if overlapping with previous
            if (start < lastEnd) continue;

            // Add text before entity
            if (start > lastEnd) {
                result.push({ text: text.slice(lastEnd, start) });
            }

            // Add entity
            result.push({
                text: text.slice(start, end),
                entity,
            });

            lastEnd = end;
        }

        // Add remaining text
        if (lastEnd < text.length) {
            result.push({ text: text.slice(lastEnd) });
        }

        return result;
    }, [text, sortedEntities]);

    if (sortedEntities.length === 0) {
        return <span className={className}>{text}</span>;
    }

    return (
        <TooltipProvider>
            <span className={className}>
                {segments.map((segment, index) => {
                    if (!segment.entity) {
                        return <span key={index}>{segment.text}</span>;
                    }

                    const colors = entityColors[segment.entity.entity_type] ?? entityColors.default;
                    const label = entityLabels[segment.entity.entity_type] ?? segment.entity.entity_type;

                    return (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <span
                                    className={cn(
                                        'inline-block px-1 py-0.5 rounded border cursor-pointer transition-colors',
                                        'hover:opacity-80',
                                        colors.bg,
                                        colors.text,
                                        colors.border
                                    )}
                                    onClick={() => onEntityClick?.(segment.entity!)}
                                >
                                    {segment.text}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="text-xs">
                                    <p className="font-semibold">{label}</p>
                                    {segment.entity.confidence !== undefined && (
                                        <p className="text-muted-foreground">
                                            Confiança: {(segment.entity.confidence * 100).toFixed(0)}%
                                        </p>
                                    )}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </span>
        </TooltipProvider>
    );
}

export default EntityHighlighter;

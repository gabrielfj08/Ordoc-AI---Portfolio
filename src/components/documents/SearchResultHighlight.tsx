"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchResultHighlightProps {
    text: string;
    searchTerm: string;
    maxLength?: number;
}

export function SearchResultHighlight({
    text,
    searchTerm,
    maxLength = 150
}: SearchResultHighlightProps) {
    if (!searchTerm || !text) {
        return <span className="text-xs text-slate-600">{text.substring(0, maxLength)}...</span>;
    }

    // Find the position of the search term (case insensitive)
    const lowerText = text.toLowerCase();
    const lowerTerm = searchTerm.toLowerCase();
    const index = lowerText.indexOf(lowerTerm);

    if (index === -1) {
        return <span className="text-xs text-slate-600">{text.substring(0, maxLength)}...</span>;
    }

    // Extract a snippet around the found term
    const snippetStart = Math.max(0, index - 50);
    const snippetEnd = Math.min(text.length, index + searchTerm.length + 100);
    const snippet = text.substring(snippetStart, snippetEnd);

    // Split the snippet to highlight the search term
    const parts = snippet.split(new RegExp(`(${searchTerm})`, 'gi'));

    return (
        <div className="flex items-start gap-2 p-2 bg-blue-50/50 rounded border border-blue-100">
            <Search size={12} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-700 leading-relaxed">
                {snippetStart > 0 && '...'}
                {parts.map((part, i) => (
                    part.toLowerCase() === searchTerm.toLowerCase() ? (
                        <mark key={i} className="bg-yellow-200 text-slate-900 font-semibold px-0.5 rounded">
                            {part}
                        </mark>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                ))}
                {snippetEnd < text.length && '...'}
            </p>
        </div>
    );
}

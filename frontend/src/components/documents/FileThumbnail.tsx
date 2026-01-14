"use client";

import { FileText, FileSpreadsheet, FileArchive, Image as ImageIcon, File } from "lucide-react";

interface FileThumbnailProps {
    name: string;
    health?: 'healthy' | 'warning' | 'critical';
}

export const FileThumbnail = ({ name, health }: FileThumbnailProps) => {
    const ext = name.split('.').pop()?.toLowerCase();

    // PDF Thumbnail (Full Document Page Look)
    if (ext === 'pdf') {
        return (
            <div className="w-full h-full bg-white flex flex-col p-8 gap-2.5 overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
                {/* Header / Title Mock */}
                <div className="h-2 w-1/3 bg-slate-800 rounded-sm mb-2" />

                {/* Text Lines - High Contrast & Finer */}
                <div className="space-y-1.5 w-full">
                    <div className="h-1 w-full bg-slate-600 rounded-sm" />
                    <div className="h-1 w-full bg-slate-600 rounded-sm" />
                    <div className="h-1 w-full bg-slate-600 rounded-sm" />
                    <div className="h-1 w-2/3 bg-slate-600 rounded-sm" />
                </div>

                {/* Paragraph 2 */}
                <div className="space-y-1.5 w-full mt-3">
                    <div className="h-1 w-full bg-slate-600 rounded-sm" />
                    <div className="h-1 w-full bg-slate-600 rounded-sm" />
                    <div className="h-1 w-full bg-slate-600 rounded-sm" />
                    <div className="h-1 w-4/5 bg-slate-600 rounded-sm" />
                </div>

                {/* PDF Label Watermark (Subtle but Visible) */}
                <div className="absolute bottom-3 right-3 opacity-30 font-black text-4xl tracking-tighter text-red-950 select-none">
                    PDF
                </div>
            </div>
        );
    }

    // Spreadsheet (Excel Full Grid Look)
    if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        return (
            <div className="w-full h-full bg-white flex flex-col relative group-hover:scale-105 transition-transform duration-500">
                {/* Header Row */}
                <div className="flex h-6 border-b border-green-100 bg-green-50/50">
                    <div className="w-8 border-r border-green-100 bg-green-100/30" />
                    <div className="flex-1 border-r border-green-100" />
                    <div className="flex-1 border-r border-green-100" />
                    <div className="flex-1" />
                </div>
                {/* Grid Rows */}
                <div className="flex-1 flex flex-col">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex-1 flex border-b border-slate-100 min-h-[20px]">
                            <div className="w-8 border-r border-slate-100 bg-slate-50/50" />
                            <div className="flex-1 border-r border-slate-100" />
                            <div className="flex-1 border-r border-slate-100" />
                            <div className="flex-1" />
                        </div>
                    ))}
                </div>
                {/* XLS Label Watermark */}
                <div className="absolute bottom-2 right-2 opacity-10 font-black text-4xl tracking-tighter text-green-900 select-none">
                    XLS
                </div>
            </div>
        );
    }

    // Zip/Archive (Full Folder Look)
    if (ext === 'zip' || ext === 'rar' || ext === '7z') {
        return (
            <div className="w-full h-full bg-amber-50 flex items-center justify-center relative overlow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="w-24 h-16 bg-amber-200 rounded-lg shadow-sm border border-amber-300 relative flex items-center justify-center">
                    <div className="absolute -top-3 left-0 w-8 h-4 bg-amber-300 rounded-t-lg" />
                    <FileArchive size={24} className="text-amber-600/50" />
                </div>
                <div className="absolute bottom-2 right-3 opacity-10 font-black text-3xl tracking-tighter text-amber-900 select-none">
                    ZIP
                </div>
            </div>
        );
    }

    // Image (Photo Look)
    if (['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(ext || '')) {
        return (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                    <ImageIcon className="text-slate-300" size={48} />
                </div>
            </div>
        );
    }

    // Default File
    return (
        <div className="w-full h-full bg-slate-50 flex items-center justify-center border-t border-slate-100">
            <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <FileText className="text-slate-300" size={32} />
            </div>
        </div>
    );
};

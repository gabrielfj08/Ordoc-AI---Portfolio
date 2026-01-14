"use client";

import React from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportMenuProps {
    onExportExcel?: () => void;
    onExportPDF?: () => void;
    onExportCSV?: () => void;
}

export function ExportMenu({ onExportExcel, onExportPDF, onExportCSV }: ExportMenuProps) {
    const handleExportExcel = () => {
        console.log('Exportando para Excel...');
        onExportExcel?.();
    };

    const handleExportPDF = () => {
        console.log('Exportando para PDF...');
        onExportPDF?.();
    };

    const handleExportCSV = () => {
        console.log('Exportando para CSV...');
        onExportCSV?.();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                    <Download size={16} />
                    Exportar
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleExportExcel} className="gap-2 cursor-pointer">
                    <FileSpreadsheet size={16} className="text-green-600" />
                    Exportar para Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
                    <FileText size={16} className="text-red-600" />
                    Exportar para PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV} className="gap-2 cursor-pointer">
                    <FileSpreadsheet size={16} className="text-blue-600" />
                    Exportar para CSV
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

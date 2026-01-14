"use client";

import { UploadCloud, FileText } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";

interface UploadSelectorProps {
    onFileReady: (file: File) => void;
    onCancel: () => void;
}

export const UploadSelector = ({ onFileReady, onCancel }: UploadSelectorProps) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === "application/pdf") {
                onFileReady(file);
            } else {
                alert("Por favor carregue um arquivo PDF.");
            }
        }
    }, [onFileReady]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === "application/pdf") {
                onFileReady(file);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[500px] p-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-full max-w-xl text-center space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Vamos começar</h2>
                    <p className="text-slate-500">Selecione o documento que você deseja preparar.</p>
                </div>

                <div
                    className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300
                    ${dragActive ? "border-orange-500 bg-orange-50 scale-102" : "border-slate-200 hover:border-orange-300 hover:bg-slate-50"}
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept="application/pdf"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleChange}
                    />

                    <div className="flex flex-col items-center gap-4 pointer-events-none">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors
                            ${dragActive ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-400"}
                        `}>
                            {dragActive ? <FileText size={40} /> : <UploadCloud size={40} />}
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-slate-700">
                                Clique ou arraste seu arquivo PDF aqui
                            </p>
                            <p className="text-xs text-slate-400">
                                Suporta apenas arquivos PDF até 10MB
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <Button variant="ghost" onClick={onCancel} className="text-slate-500">Voltar</Button>
                </div>
            </div>
        </div>
    );
};

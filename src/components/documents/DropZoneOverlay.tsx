"use client";

import * as React from "react";
import { UploadCloud } from "lucide-react";

interface DropZoneProps {
  isVisible: boolean;
}

export const DropZoneOverlay = ({ isVisible }: DropZoneProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-100 bg-blue-600/10 backdrop-blur-[2px] pointer-events-none flex items-center justify-center border-4 border-dashed border-blue-500 m-4 rounded-3xl animate-in fade-in zoom-in duration-200">
      <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4 border border-blue-100 shadow-blue-200/50">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
          <UploadCloud size={40} className="text-blue-600 animate-bounce" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-800">Solte para fazer upload</h3>
          {/* Ajustado max-w para classe Tailwind padrão */}
          <p className="text-sm text-slate-500 max-w-240px">
            Seus arquivos serão adicionados automaticamente ao diretório atual.
          </p>
        </div>
      </div>
    </div>
  );
};
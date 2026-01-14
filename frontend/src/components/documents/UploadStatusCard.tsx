"use client";

import * as React from "react";
import {
  X, CheckCircle2, Loader2, FileText,
  Minus, Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Importação do tipo oficial do nosso motor de upload
import { FileUploadStatus } from "@/hooks/useFileUpload";
interface UploadStatusCardProps {
  uploads: FileUploadStatus[];
  onClear: () => void;
}

export const UploadStatusCard = ({ uploads, onClear }: UploadStatusCardProps) => {
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [isClosed, setIsClosed] = React.useState(false);
  // Se o utilizador fechar ou não houver ficheiros, não renderiza nada
  if (isClosed || uploads.length === 0) return null;
  const uploadingItems = uploads.filter(u => u.status === "uploading");
  const isFinished = uploadingItems.length === 0;
  return (
    <div className={`fixed bottom-0 right-8 w-360px bg-card shadow-2xl rounded-t-xl border border-border z-110 transition-all duration-300 transform ${isMinimized ? "translate-y-[calc(100%-48px)]" : "translate-y-0"}`}>
      {/* Cabeçalho Profissional - Conecta com a lógica do STORAGE */}
      <div
        className="bg-foreground text-background px-4 py-3 rounded-t-xl flex items-center justify-between cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <span className="text-sm font-medium">
          {!isFinished
            ? `Fazendo upload de ${uploads.length} itens...`
            : `${uploads.length} uploads concluídos`}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-xs"
            className="hover:bg-background/20 text-background"
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            className="hover:bg-background/20 text-background"
            onClick={(e) => { e.stopPropagation(); setIsClosed(true); onClear(); }}
          >
            <X size={16} />
          </Button>
        </div>
      </div>
      {/* Lista Real de Ficheiros e Estados de Sincronização */}
      <div className="max-h-320px overflow-y-auto">
        {uploads.map((file) => (
          <div key={file.id} className="p-4 border-b border-border flex items-center justify-between group hover:bg-muted relative">
            <div className="flex items-center gap-3 overflow-hidden mr-4">
              <div className="shrink-0">
                <FileText size={20} className="text-blue-500" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-foreground truncate" title={file.name}>
                  {file.name}
                </span>
                {file.status === "uploading" && (
                  <span className="text-xs text-muted-foreground">{file.progress}% concluído</span>
                )}
                {file.status === "complete" && (
                  <span className="text-xs text-green-600 font-medium">Concluído</span>
                )}
                {file.status === "error" && (
                  <span className="text-xs text-destructive font-medium">Erro no upload</span>
                )}
              </div>
            </div>
            <div className="shrink-0">
              {file.status === "complete" ? (
                <CheckCircle2 size={18} className="text-green-500 fill-green-50" />
              ) : file.status === "uploading" ? (
                <div className="relative flex items-center justify-center">
                  <Loader2 size={18} className="text-blue-500 animate-spin" />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-border" />
              )}
            </div>
            {/* Barra de progresso dinâmica baseada no estado real */}
            {file.status === "uploading" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
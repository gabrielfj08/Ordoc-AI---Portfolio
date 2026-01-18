"use client";

import * as React from "react";
import { useSignatureStore } from "@/store/signatureStore";
import { Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export const OngoingProcessesCard = () => {
  const [mounted, setMounted] = React.useState(false);
  const { sealedDocuments } = useSignatureStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-background rounded-2xl border border-border p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-foreground">Processos em Andamento</h3>
          <p className="text-xs text-muted-foreground font-medium">Controle de fluxos de assinatura ativos</p>
        </div>
        <Link href="/signature" className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors">
          <ArrowRight size={20} />
        </Link>
      </div>

      <div className="space-y-5 flex-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {!mounted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock size={32} className="text-muted-foreground/30 animate-pulse mb-2" />
            <p className="text-xs text-muted-foreground font-medium">Carregando...</p>
          </div>
        ) : sealedDocuments.length > 0 ? (
          sealedDocuments.map((doc) => (
            <div key={doc.id} className="group cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${doc.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {doc.status === 'completed' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground group-hover:text-orange-600 transition-colors truncate max-w-[150px]">{doc.name}</p>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight">
                      {doc.signers?.length || 0} Signatários • {doc.health === 'healthy' ? 'Integridade OK' : 'Revisão Necessária'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-muted-foreground">{doc.progress || 0}%</span>
              </div>
              <Progress value={doc.progress || 0} className="h-1.5 bg-muted" />
            </div>
          ))
        ) : (
          /* Estado Vazio: Incentivo ao Uso */
          <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-border rounded-xl h-full">
            <AlertCircle size={32} className="text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground font-medium px-4">Não há processos ativos no momento. Que tal selar um novo documento?</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
          <span>Total de Ativos: {sealedDocuments.length}</span>
          <span className="text-orange-600 cursor-pointer hover:underline">Ver Todos</span>
        </div>
      </div>
    </div>
  );
};
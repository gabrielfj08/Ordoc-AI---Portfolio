"use client";

// src/components/my-day/AssistantCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const AssistantCard = () => {
  return (
    <Card className="border-none shadow-xl bg-orange-500 text-white overflow-hidden relative group">
      {/* Decorative background circle */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

      <CardContent className="px-5 pt-5">

        {/* Cabeçalho do Card */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className="bg-white/20 p-2.5 rounded-xl shadow-inner backdrop-blur-sm">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <h3 className="font-bold text-xl leading-tight tracking-tight">
                Eficiência Operacional
              </h3>
              <p className="text-white/90 text-sm font-medium mt-1">
                Sua operação flui bem hoje.
              </p>
            </div>
          </div>
          <span className="text-[11px] bg-white text-[#f97316] px-3 py-1.5 rounded-full font-extrabold uppercase tracking-widest shadow-sm">
            92% Otimizado
          </span>
        </div>

        {/* Grade de Ações Sugeridas */}
        <div className="space-y-4">
          <p className="text-xs font-black text-white/80 uppercase flex items-center gap-2 tracking-tighter">
            <span className="h-px w-4 bg-white/40"></span>
            Diagnóstico em Tempo Real
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-white/10 hover:bg-white/20 border border-white/10 text-white h-auto py-4 px-4 flex flex-col gap-2 items-start transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-lg">
              <div className="text-left w-full">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] uppercase font-extrabold text-white/70 antialiased">Gargalo</p>
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                </div>
                <p className="text-lg font-black leading-none antialiased">4 Dias</p>
                <p className="text-[10px] font-semibold text-white/95 mt-1 antialiased">Assinatura Dir. Financeiro</p>
                <Button
                  onClick={() => console.log('Enviar lembrete')}
                  className="mt-3 text-[9px] bg-white/20 hover:bg-white/30 px-2 py-1 rounded w-full text-center font-extrabold antialiased h-auto text-white border-none"
                >
                  Enviar Lembrete
                </Button>
              </div>
            </div>

            <div className="bg-white/10 hover:bg-white/20 border border-white/10 text-white h-auto py-4 px-4 flex flex-col gap-2 items-start transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-lg">
              <div className="text-left w-full">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] uppercase font-extrabold text-white/70 antialiased">Uploads</p>
                  <span className="text-[9px] font-mono antialiased">↑ 12%</span>
                </div>
                <p className="text-lg font-black leading-none antialiased">14 Docs</p>
                <p className="text-[10px] font-semibold text-white/95 mt-1 antialiased">Processados hoje</p>
                <Button
                  onClick={() => console.log('Ver documentos')}
                  className="mt-3 text-[9px] bg-white/20 hover:bg-white/30 px-2 py-1 rounded w-full text-center font-extrabold antialiased h-auto text-white border-none"
                >
                  Ver Documentos
                </Button>
              </div>
            </div>

            <div className="bg-white/10 hover:bg-white/20 border border-white/10 text-white h-auto py-4 px-4 flex flex-col gap-2 items-start transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-lg">
              <div className="text-left w-full">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] uppercase font-extrabold text-white/70 antialiased">Pendências</p>
                </div>
                <p className="text-lg font-black leading-none antialiased">39 Aprovações</p>
                <p className="text-[10px] font-semibold text-white/95 mt-1 antialiased">Tarefas ativas</p>
                <Button
                  onClick={() => console.log('Verificar pendências')}
                  className="mt-3 text-[9px] bg-white/20 hover:bg-white/30 px-2 py-1 rounded w-full text-center font-extrabold antialiased h-auto text-white border-none"
                >
                  Verificar Pendências
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
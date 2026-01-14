// src/components/my-day/ResumeWorkCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Zap, ArrowRight, Sparkles } from "lucide-react";

export const ResumeWorkCard = () => {
  return (
    <Card className="border-none shadow-sm bg-white overflow-visible transition-all hover:shadow-xl cursor-pointer group relative">
      {/* Cognitive Summary Hover */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-purple-600 text-white p-3 rounded-xl shadow-2xl w-64 pointer-events-none z-50 flex items-start gap-2 border border-purple-400">
        <Sparkles size={16} className="shrink-0 mt-0.5 text-purple-200" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-purple-200 mb-0.5">Resumo IA</p>
          <p className="text-[11px] leading-snug">
            Você revisou <span className="font-bold text-white">80%</span> das cláusulas de LGPD. Falta validar a <span className="font-bold text-white underline decoration-white/30">Transferência Internacional</span>.
          </p>
        </div>
        {/* Little arrow */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-600 rotate-45"></div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Continue de onde parou</h3>
          </div>
          <Zap size={14} className="text-orange-500 fill-orange-500 transition-transform group-hover:scale-125" />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-blue-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
            <FileText size={24} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-800 transition-colors group-hover:text-blue-700">Contrato de Prestação - TI</h4>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[80%]"></div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">80% concluído</span>
            </div>
          </div>
        </div>

        <Button className="w-full border-2 border-orange-300 text-orange-500 bg-transparent hover:bg-orange-500 hover:text-white transition-all text-xs font-semibold antialiased h-9 group/btn">
          RETOMAR EDIÇÃO <ArrowRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};
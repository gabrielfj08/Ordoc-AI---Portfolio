"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export const FocusModal = ({ isOpen, onClose, docData }: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          {/* O Desfoque Cognitivo: Isola o cérebro da interface principal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-card w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-50"
          >
            {/* Header do Modal com Insight de IA */}
            <div className="bg-primary p-6 text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-foreground/20 rounded-2xl flex items-center justify-center">
                  <Zap className="fill-primary-foreground" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Retomada Inteligente</h2>
                  <p className="text-sm opacity-80 underline italic">A IA Ordoc parou aqui para você:</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-primary-foreground/20 text-primary-foreground">
                <X size={24} />
              </Button>
            </div>
            {/* Conteúdo: Preview do Documento + Ação Sugerida */}
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 bg-muted p-8 overflow-auto flex justify-center">
                {/* O Documento aberto exatamente na página/cláusula pendente */}
                <div className="w-full max-w-[500px] h-[700px] bg-card shadow-lg p-10 relative">
                  <div className="absolute top-40 left-0 w-full h-20 bg-primary/10 border-y-2 border-primary flex items-center px-10">
                    <span className="text-primary font-bold text-xs italic">
                      🎯 IA: Verifique esta cláusula de rescisão antes de assinar.
                    </span>
                  </div>
                  <div className="space-y-4 opacity-20">
                    {[...Array(15)].map((_, i) => <div key={i} className="h-3 bg-muted rounded w-full" />)}
                  </div>
                </div>
              </div>
              {/* Sidebar de Ação Rápida */}
              <aside className="w-80 border-l border-border p-6 space-y-6 bg-muted overflow-y-auto">
                <div>
                  <h3 className="font-bold text-foreground mb-2">Resumo da Pendência</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Faltava apenas validar a concordância do foro. Todos os outros 12 pontos de compliance já foram aprovados.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    Aprovar e Selar <ArrowRight size={16} />
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    Ignorar Aviso
                  </Button>
                </div>
              </aside>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
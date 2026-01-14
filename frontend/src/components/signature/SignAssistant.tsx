"use client";

import React, { useState } from "react";
import { Zap, Loader2, Sparkles, Check, X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignAssistantProps {
    onAddField: (type: 'signature' | 'initial' | 'date', x: number, y: number) => void;
}

export const SignAssistant = ({ onAddField }: SignAssistantProps) => {
    const [state, setState] = useState<'idle' | 'analyzing' | 'suggestion'>('idle');
    const [isVisible, setIsVisible] = useState(true);

    const startAnalysis = () => {
        setState('analyzing');
        // Mock analysis delay
        setTimeout(() => {
            setState('suggestion');
        }, 2000);
    };

    const applySuggestion = () => {
        // Adds a rubric field at a specific "detected" position (e.g., bottom right of page 1)
        onAddField('initial', 400, 600);
        setIsVisible(false); // Hide after applying

        // Reset state after a delay if we want to reuse it (optional)
        setTimeout(() => {
            setState('idle');
            setIsVisible(true);
        }, 1000);
    };

    const dismiss = () => {
        setState('idle');
    };

    if (!isVisible && state === 'idle') return (
        <Button
            onClick={() => setIsVisible(true)}
            className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 z-50 flex items-center justify-center animate-in fade-in zoom-in duration-300"
        >
            <Zap size={20} className="fill-yellow-400 text-yellow-400" />
        </Button>
    );

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-500 ease-out ${state === 'suggestion' ? 'w-[340px]' : 'w-auto'}`}>

            {/* Expanded Suggestion Card */}
            {state === 'suggestion' && (
                <div className="bg-white/95 backdrop-blur-md border border-purple-100 shadow-2xl rounded-2xl p-4 w-full animate-in slide-in-from-bottom-5 duration-500">
                    <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg shrink-0">
                            <Sparkles size={18} className="text-purple-600" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                Insight de Compliance
                                <span className="bg-yellow-100 text-yellow-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase">Risco Médio</span>
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Detectei uma <strong>Cláusula de Exclusividade</strong> na página 1. Recomendo adicionar uma rubrica do diretor jurídico.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={dismiss}
                            className="flex-1 text-slate-500 hover:text-slate-700 text-xs h-8"
                        >
                            <X size={14} className="mr-1" /> Ignorar
                        </Button>
                        <Button
                            size="sm"
                            onClick={applySuggestion}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 font-semibold shadow-purple-200 shadow-lg"
                        >
                            <Check size={14} className="mr-1" /> Aplicar Rubrica
                        </Button>
                    </div>
                </div>
            )}

            {/* Trigger Button */}
            {state !== 'suggestion' && (
                <Button
                    onClick={startAnalysis}
                    disabled={state === 'analyzing'}
                    className={`
                h-12 rounded-full shadow-xl transition-all duration-300 flex items-center gap-2 px-4
                ${state === 'analyzing' ? 'bg-white text-purple-600 border border-purple-100 w-40 justify-center' : 'bg-slate-900 text-white hover:bg-slate-800 w-12 hover:w-auto overflow-hidden group justify-center hover:justify-start'}
            `}
                >
                    {state === 'analyzing' ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span className="text-xs font-bold animate-pulse">Analisando...</span>
                        </>
                    ) : (
                        <>
                            <Zap size={20} className="shrink-0 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform" />
                            <span className="w-0 group-hover:w-auto opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-300 text-xs font-bold pl-1">
                                Assistente IA
                            </span>
                        </>
                    )}
                </Button>
            )}
        </div>
    );
};

"use client";

import { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, Bot, Target } from "lucide-react";

export const AIEducationPanel = () => {
    const [instruction, setInstruction] = useState("Secretaria pública que segue a Lei 14.133. Priorize compliance em licitações e análise de notas fiscais.");
    const [detectedMode, setDetectedMode] = useState("Padrão");
    const [focusAreas, setFocusAreas] = useState<string[]>([]);

    // Simulação de IA Processando a Instrução em Tempo Real
    useEffect(() => {
        const lowerInstruction = instruction.toLowerCase();

        if (lowerInstruction.includes("logística") || lowerInstruction.includes("transporte") || lowerInstruction.includes("frete")) {
            setDetectedMode("Operação Logística");
            setFocusAreas(["Notas Fiscais", "Prazos de Entrega", "Seguro de Carga", "Canhotos de Entrega"]);
        } else if (lowerInstruction.includes("jurídico") || lowerInstruction.includes("advocacia") || lowerInstruction.includes("direito")) {
            setDetectedMode("Compliance Jurídico");
            setFocusAreas(["Prazos Processuais", "LGPD/GDPR", "Cláusulas de Rescisão", "Petições"]);
        } else if (lowerInstruction.includes("público") || lowerInstruction.includes("secretaria") || lowerInstruction.includes("governo") || lowerInstruction.includes("lei 14.133") || lowerInstruction.includes("licitação")) {
            setDetectedMode("Gestão Governamental");
            setFocusAreas(["Lei 14.133", "Transparência", "Editais e Licitações", "Prestação de Contas"]);
        } else if (lowerInstruction.includes("financeiro") || lowerInstruction.includes("contábil") || lowerInstruction.includes("fiscal")) {
            setDetectedMode("Gestão Financeira");
            setFocusAreas(["Notas Fiscais", "Conciliação Bancária", "Tributos", "Relatórios Contábeis"]);
        } else if (lowerInstruction.includes("rh") || lowerInstruction.includes("recursos humanos") || lowerInstruction.includes("pessoal")) {
            setDetectedMode("Recursos Humanos");
            setFocusAreas(["Contratos de Trabalho", "Folha de Pagamento", "Admissões", "Documentação Trabalhista"]);
        } else {
            setDetectedMode("Gestão Geral");
            setFocusAreas(["Organização", "Eficiência", "Colaboração", "Produtividade"]);
        }
    }, [instruction]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input de Instruções */}
            <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-[40px] space-y-3 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 text-orange-600 mb-2">
                    <Bot size={24} className="animate-pulse" />
                    <h3 className="font-bold uppercase tracking-widest text-xs">Instruções de Inteligência</h3>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                    O que a <strong className="text-orange-600">IA Ordoc</strong> deve saber sobre sua organização para entregar insights precisos?
                </p>
                <textarea
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    className="w-full h-40 bg-background rounded-3xl p-6 text-sm border border-orange-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
                    placeholder="Ex: Somos uma empresa de logística focada em transporte internacional. Priorize prazos de desembaraço aduaneiro e conformidade com a ISO 9001..."
                />
                <div className="flex items-center gap-2 text-xs text-orange-600">
                    <Sparkles size={12} />
                    <span className="font-medium">A IA aprende em tempo real com suas instruções</span>
                </div>
            </div>

            {/* Preview de Adaptação (O espelho da IA) */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] p-6 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles size={120} />
                </div>

                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Perfil Cognitivo Ativo</span>
                    </div>

                    <div>
                        <h4 className="text-2xl font-black text-orange-500 mb-1">{detectedMode}</h4>
                        <p className="text-xs text-slate-400">A plataforma agora prioriza estes eixos:</p>
                    </div>

                    <div className="space-y-2">
                        {focusAreas.map((area, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 bg-white/5 border border-white/10 p-2.5 rounded-2xl animate-in fade-in slide-in-from-left duration-500"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <Target size={14} className="text-orange-500 shrink-0" />
                                <span className="text-xs font-medium flex-1">{area}</span>
                                <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                            </div>
                        ))}
                    </div>

                    <div className="pt-3 border-t border-white/10">
                        <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold tracking-tight">
                            Ajuste as instruções ao lado para recalibrar o cérebro da plataforma.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

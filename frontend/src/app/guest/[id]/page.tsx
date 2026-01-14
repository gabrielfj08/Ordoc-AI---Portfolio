"use client";

import { useState } from "react";
import { SignEditor } from "@/components/signature/SignEditor";
import { DocumentLineage } from "@/components/signature/DocumentLineage";
import { AuditCertificate } from "@/components/signature/AuditCertificate";
import { ShieldCheck, Info, Download, CheckCircle2, Share2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GuestSignPage() {
    // Gerenciamento de Etapas: welcome -> signing -> completed
    const [step, setStep] = useState<'welcome' | 'signing' | 'completed'>('welcome');
    const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

    // Renderização da Etapa 1: Boas-vindas e Termos Jurídicos
    if (step === 'welcome') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
                <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-500">
                    <div className="bg-orange-600 p-8 text-white flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Portal de Assinatura Segura</h1>
                            <p className="text-sm opacity-80 italic">Powered by Ordoc ECR</p>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-4">
                            <Info className="text-blue-600 shrink-0" size={20} />
                            <p className="text-xs text-blue-700 leading-relaxed">
                                Você foi convidado pela <strong>Adsumtec</strong> para assinar o documento:
                                <span className="block font-bold mt-1 text-sm italic">"Contrato_de_Parceria_v2.pdf"</span>
                            </p>
                        </div>

                        <DocumentLineage />

                        <div className="space-y-4 pt-4">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="mt-1 w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                    onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                                />
                                <span className="text-[11px] text-slate-500 leading-tight">
                                    Eu aceito realizar esta assinatura de forma eletrônica sob as normas da ICP-Brasil e concordo com a validade jurídica deste registro imutável via Ordoc ECR.
                                </span>
                            </label>

                            <Button
                                disabled={!hasAcceptedTerms}
                                onClick={() => setStep('signing')}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-12 rounded-xl disabled:bg-slate-200 transition-all"
                            >
                                Prosseguir para Assinatura
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Renderização da Etapa 3: Sucesso e Manifesto de Auditoria (Após Assinar)
    if (step === 'completed') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-in fade-in duration-700 overflow-y-auto">
                <div className="max-w-4xl w-full flex flex-col items-center py-10">

                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full mb-8 text-center border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 mb-2">Assinatura Concluída!</h1>
                        <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm">
                            O documento foi selado com sucesso e o registro de integridade foi gerado em nossa rede ECR.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                            <Button
                                onClick={() => window.print()}
                                className="bg-slate-900 text-white rounded-xl h-14 font-bold flex gap-3 hover:scale-105 transition-transform"
                            >
                                <Download size={20} /> Baixar Comprovante
                            </Button>
                            <Button
                                variant="outline"
                                className="border-slate-200 text-slate-600 rounded-xl h-14 font-bold flex gap-3 hover:bg-slate-50"
                            >
                                <Share2 size={20} /> Compartilhar
                            </Button>
                        </div>
                    </div>

                    <div className="w-full opacity-80 hover:opacity-100 transition-opacity scale-95 origin-top print:opacity-100 print:scale-100">
                        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 italic print:hidden">
                            Visualização do Manifesto de Auditoria
                        </p>
                        <AuditCertificate
                            docData={{ name: "Contrato_de_Parceria_v2.pdf" }}
                            signers={[{ name: "Visitante Autenticado", email: "convidado@email.com", color: "#f97316" }]}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Renderização da Etapa 2: Editor de Assinatura (Modo Guest)
    return (
        <div className="h-screen flex flex-col animate-in fade-in duration-300">
            <header className="h-14 bg-slate-900 text-white flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-orange-500 italic text-xl">O</span>
                    <span className="text-sm font-bold tracking-tight">Ordoc Portal</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] text-slate-400 font-mono hidden md:block">HASH: e3b0c442...</span>
                    {/* Simulamos a conclusão clicando aqui, mas no real seria no botão do SignEditor */}
                    <Button
                        onClick={() => setStep('completed')}
                        className="bg-green-600 hover:bg-green-700 text-xs font-bold gap-2 h-8 rounded-lg"
                    >
                        <CheckCircle2 size={14} /> Finalizar Assinatura
                    </Button>
                </div>
            </header>
            <div className="flex-1 overflow-hidden">
                <SignEditor docName="Contrato_de_Parceria_v2.pdf" isGuestMode={true} />
            </div>
        </div>
    );
}
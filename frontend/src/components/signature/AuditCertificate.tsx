"use client";

import { ShieldCheck, Calendar, Fingerprint, Globe, CheckCircle2 } from "lucide-react";

export const AuditCertificate = ({ docData, signers }: any) => {
    return (
        <div className="w-[800px] bg-white p-12 shadow-2xl border-[12px] border-slate-50 relative overflow-hidden font-sans mx-auto my-10">
            {/* Selo d'água decorativo de fundo */}
            <ShieldCheck className="absolute -bottom-20 -right-20 w-96 h-96 text-slate-50 opacity-50" />

            {/* Cabeçalho do Certificado */}
            <header className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-10 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black italic">O</div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Manifesto de Assinaturas</h1>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Ordoc ECR - Electronic Content Record • Protocolo #ORD-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
                <div className="text-right">
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100 mb-2">
                        <CheckCircle2 size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Documento Selado e Íntegro</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">HASH SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e464...</p>
                </div>
            </header>

            {/* Informações do Documento Original */}
            <section className="mb-10 relative z-10">
                <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Dados do Documento</h2>
                <div className="grid grid-cols-2 gap-8 bg-slate-50 p-6 rounded-2xl">
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Nome do Arquivo</p>
                        <p className="text-sm font-bold text-slate-800">{docData?.name || "Contrato_de_Servicos_Adsum.pdf"}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Data da Selagem Final</p>
                        <p className="text-sm font-bold text-slate-800">{new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
                    </div>
                </div>
            </section>

            {/* Histórico de Assinaturas (Audit Trail) */}
            <section className="mb-10 relative z-10">
                <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Trilha de Auditoria</h2>
                <div className="space-y-4">
                    {signers.map((signer: any, idx: number) => (
                        <div key={idx} className="border border-slate-100 rounded-2xl p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm`} style={{ backgroundColor: signer.color }}>
                                    {signer.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{signer.name}</p>
                                    <p className="text-[11px] text-slate-500">{signer.email}</p>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <div className="flex items-center justify-end gap-2 text-slate-600">
                                    <Fingerprint size={12} className="text-orange-500" />
                                    <span className="text-[10px] font-mono">IP: 189.12.XXX.XXX</span>
                                </div>
                                <div className="flex items-center justify-end gap-2 text-slate-600">
                                    <Calendar size={12} className="text-orange-500" />
                                    <span className="text-[10px] font-mono">{new Date().toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-end gap-2 text-slate-600">
                                    <Globe size={12} className="text-orange-500" />
                                    <span className="text-[10px] font-mono font-bold uppercase">Assinatura Eletrônica Autenticada</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Rodapé de Validação Jurídica */}
            <footer className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-end relative z-10">
                <div className="max-w-[400px]">
                    <p className="text-[9px] text-slate-400 leading-relaxed italic">
                        Este documento é uma representação visual das assinaturas eletrônicas colhidas na plataforma Ordoc.
                        A autenticidade pode ser verificada a qualquer momento através do portal de conferência ou via leitura do HASH SHA-256.
                        Em conformidade com a MP 2.200-2/2001 e normas globais de ECR.
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    {/* QR Code Simulado */}
                    <div className="w-20 h-20 bg-white border-4 border-slate-50 p-1 mb-2">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ordoc.com/verify/123" alt="QR Code de Verificação" className="w-full h-full grayscale" />
                    </div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Verificar Original</span>
                </div>
            </footer>
        </div>
    );
};
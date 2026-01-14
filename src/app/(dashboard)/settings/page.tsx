"use client";

import { MainContainer } from "@/components/layout/MainContainer";
import { User, Building2, Sparkles, Monitor, Camera, Shield, Bell, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AIEducationPanel } from "@/components/settings/AIEducationPanel";

export default function SettingsPage() {
    return (
        <MainContainer>
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">

                {/* SEÇÃO 1: IDENTIDADE PROFISSIONAL (ESTILO LINKEDIN) */}
                <section className="bg-background rounded-[40px] border border-border overflow-hidden shadow-sm">
                    {/* Banner Superior */}
                    <div className="h-32 bg-gradient-to-r from-slate-900 to-slate-800 relative">
                        <div className="absolute inset-0 bg-[url('/api/placeholder/1200/160')] bg-cover bg-center opacity-20"></div>
                        <Button
                            variant="outline"
                            className="absolute bottom-4 right-4 bg-white/10 border-white/20 text-white text-xs hover:bg-white/20 backdrop-blur-sm"
                        >
                            <Camera size={14} className="mr-2" />
                            Alterar Banner
                        </Button>
                    </div>

                    {/* Conteúdo do Perfil */}
                    <div className="px-6 pb-6 relative">
                        {/* Avatar e Ações */}
                        <div className="flex justify-between items-end -mt-12 mb-3">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-3xl bg-muted border-4 border-background overflow-hidden shadow-lg">
                                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-5xl font-bold">
                                        AS
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-2 rounded-xl shadow-lg cursor-pointer hover:bg-orange-600 transition-colors">
                                    <Camera size={16} />
                                </div>
                                {/* Badge de Certificação Digital */}
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1.5 rounded-lg shadow-lg" title="Certificado Digital Ativo">
                                    <Shield size={14} />
                                </div>
                            </div>
                            <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-8 h-11 font-bold shadow-lg shadow-orange-200">
                                Salvar Perfil
                            </Button>
                        </div>

                        {/* Informações do Perfil */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <input
                                    className="text-3xl font-black text-foreground w-full outline-none bg-transparent border-b-2 border-transparent hover:border-orange-200 focus:border-orange-500 transition-colors pb-2"
                                    placeholder="Seu Nome"
                                    defaultValue="Ana Silva"
                                />
                                <input
                                    className="text-base font-semibold text-muted-foreground w-full outline-none bg-transparent border-b border-transparent hover:border-orange-200 focus:border-orange-500 transition-colors pb-2"
                                    placeholder="Cargo ou Especialidade"
                                    defaultValue="Especialista em Gestão Documental & Logística"
                                />
                                <textarea
                                    className="w-full text-sm text-muted-foreground bg-muted p-4 rounded-2xl border border-border focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none h-24 resize-none transition-all"
                                    placeholder="Fale sobre sua atuação profissional..."
                                    defaultValue="Atuo na Secretaria de Logística com foco em compliance e gestão de contratos públicos."
                                />
                            </div>

                            {/* Estatísticas do Perfil */}
                            <div className="bg-muted rounded-3xl p-3 space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Atividade na Plataforma</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <StatCard label="Documentos Revisados" value="847" />
                                    <StatCard label="Assinaturas" value="142" />
                                    <StatCard label="Processos Criados" value="23" />
                                    <StatCard label="Dias Ativos" value="89" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SEÇÃO 2: CONTEXTO COGNITIVO */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <AIEducationPanel />
                    </div>

                    {/* Preferências da Plataforma */}
                    <div className="bg-muted border border-border p-4 rounded-[40px] space-y-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 text-foreground">
                            <Monitor size={24} />
                            <h3 className="font-bold uppercase tracking-widest text-xs">Preferências da Plataforma</h3>
                        </div>

                        <div className="space-y-4">
                            <ToggleItem
                                label="Animações Fluidas"
                                desc="Suaviza transições entre cards e páginas."
                                defaultChecked
                            />
                            <ToggleItem
                                label="Modo Imersivo"
                                desc="Esconde elementos secundários durante a revisão de documentos."
                            />
                            <ToggleItem
                                label="Briefing Matinal"
                                desc="IA prepara um resumo de voz ao iniciar o dia."
                                defaultChecked
                            />
                            <ToggleItem
                                label="Notificações Inteligentes"
                                desc="Apenas alertas críticos e urgentes."
                                defaultChecked
                            />
                        </div>
                    </div>
                </section>

                {/* SEÇÃO 3: CONTEXTO ORGANIZACIONAL */}
                <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-[40px] space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <Building2 size={28} />
                            <h3 className="font-bold text-xl">Contexto Organizacional</h3>
                        </div>
                        <p className="text-sm text-white/70 mb-6 max-w-2xl">
                            Ensine a IA sobre sua organização. Quanto mais contexto você fornecer, mais precisas serão as recomendações.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/60">Nome da Organização</label>
                                <input
                                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    placeholder="Ex: Secretaria de Logística"
                                    defaultValue="Cofre Soberano Brasil"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/60">Setor de Atuação</label>
                                <input
                                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    placeholder="Ex: Administração Pública"
                                    defaultValue="Gestão de Ativos"
                                />
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/60">Regulamentações Aplicáveis</label>
                            <div className="flex flex-wrap gap-2">
                                <Badge text="Lei 14.133" />
                                <Badge text="LGPD" />
                                <Badge text="ISO 9001" />
                                <Badge text="+ Adicionar" variant="add" />
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </MainContainer >
    );
}

// Componente de Toggle
const ToggleItem = ({ label, desc, defaultChecked }: { label: string; desc: string; defaultChecked?: boolean }) => {
    const [checked, setChecked] = useState(defaultChecked || false);

    return (
        <div className="flex items-center justify-between group cursor-pointer" onClick={() => setChecked(!checked)}>
            <div className="flex-1">
                <p className="text-sm font-bold text-foreground group-hover:text-orange-600 transition-colors">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <div className={`w-11 h-6 rounded-full p-0.5 transition-all duration-300 ${checked ? 'bg-orange-500' : 'bg-border'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
        </div>
    );
};

// Componente de Estatística
const StatCard = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-background rounded-xl p-2 border border-border">
        <p className="text-xl font-bold text-foreground">{value}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
    </div>
);

// Componente de Badge
const Badge = ({ text, variant }: { text: string; variant?: 'add' }) => (
    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${variant === 'add'
        ? 'bg-white/10 border border-white/30 text-white/60 hover:bg-white/20 cursor-pointer'
        : 'bg-orange-500/20 border border-orange-500/30 text-orange-200'
        }`}>
        {text}
    </span>
);

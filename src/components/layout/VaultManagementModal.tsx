"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    X, ShieldCheck, Activity, Key,
    History, Server, RefreshCw, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const VaultManagementModal = ({ isOpen, onClose, activeVault }: any) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/60 backdrop-blur-xl"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="bg-card w-full max-w-5xl h-[85vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative border border-border"
                    >
                        {/* Header: Status do Nó */}
                        <header className="bg-foreground p-8 text-background flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-background/10 rounded-3xl flex items-center justify-center border border-background/10 relative">
                                    <Server size={32} className="text-primary" />
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-foreground animate-pulse" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-black tracking-tight">{activeVault.name}</h2>
                                        <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-green-500/30">Online</span>
                                    </div>
                                    <p className="text-background/60 text-sm mt-1">Infraestrutura Soberana: {activeVault.location} • Latência: 12ms</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-background/10 text-background">
                                <X size={24} />
                            </Button>
                        </header>
                        <div className="flex-1 flex overflow-hidden">
                            {/* Sidebar de Navegação Interna */}
                            <aside className="w-64 border-r border-border p-6 space-y-2 bg-muted/50">
                                <nav className="space-y-1">
                                    <NavItem icon={Activity} label="Performance e Health" active />
                                    <NavItem icon={Key} label="Gestão de Chaves (KMS)" />
                                    <NavItem icon={History} label="Logs de Auditoria" />
                                    <NavItem icon={ShieldCheck} label="Políticas de Acesso" />
                                </nav>
                            </aside>
                            {/* Conteúdo Principal: Monitoramento em Tempo Real */}
                            <main className="flex-1 p-10 overflow-auto space-y-10 font-sans">
                                {/* Grid de Métricas Rápidas */}
                                <div className="grid grid-cols-3 gap-6">
                                    <MetricCard label="Uptime Mensal" value="99.99%" sub="Disponibilidade Garantida" />
                                    <MetricCard label="Requisições/s" value="1.2k" sub="Tráfego de Assinaturas" />
                                    <MetricCard label="Integridade" value="100%" sub="Sem falhas de Hashing" />
                                </div>
                                {/* Seção de Criptografia */}
                                <div className="bg-foreground rounded-3xl p-8 text-background relative overflow-hidden">
                                    <div className="relative z-10 flex justify-between items-center">
                                        <div>
                                            <h4 className="flex items-center gap-2 font-bold mb-2">
                                                <Lock size={18} className="text-primary" />
                                                Camada de Criptografia Ativa
                                            </h4>
                                            <p className="text-xs text-background/60 max-w-md">
                                                O Cofre utiliza chaves assimétricas rotacionadas a cada 30 dias via Hardware Security Module (HSM).
                                            </p>
                                            <div className="mt-6 flex items-center gap-4">
                                                <code className="bg-background/10 px-3 py-1.5 rounded-lg text-xs font-mono text-primary border border-background/5">
                                                    ID_CHAVE: RSA_4096_ADSUM_2026
                                                </code>
                                                <Button variant="outline" size="xs" className="border-background/20 bg-transparent hover:bg-background/10 text-background gap-2">
                                                    <RefreshCw size={12} /> Forçar Rotação
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold uppercase text-background/50 tracking-widest mb-2">Segurança</p>
                                            <p className="text-3xl font-black text-primary">AES-256</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Lista de Últimos Acessos (Audit Trail) */}
                                <div>
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Auditoria de Acesso (Últimos 10 min)</h4>
                                    <div className="space-y-3">
                                        <AuditRow user="Ricardo (Admin)" action="Selagem de Documento" time="Agora" />
                                        <AuditRow user="Sistema (IA)" action="Indexação Cognitiva" time="Há 2 min" />
                                        <AuditRow user="Portal Guest" action="Leitura de Metadados" time="Há 5 min" />
                                    </div>
                                </div>
                            </main>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// Sub-componentes do Dashboard
const NavItem = ({ icon: Icon, label, active }: any) => (
    <Button
        variant={active ? "default" : "ghost"}
        className={`w-full justify-start gap-3 font-bold ${active ? 'shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
    >
        <Icon size={18} /> {label}
    </Button>
);

const MetricCard = ({ label, value, sub }: any) => (
    <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground font-medium mt-1">{sub}</p>
    </div>
);

const AuditRow = ({ user, action, time }: any) => (
    <div className="flex items-center justify-between p-4 bg-muted rounded-2xl border border-border hover:border-primary/50 transition-all cursor-default">
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-bold text-foreground">{user}</span>
            <span className="text-xs text-muted-foreground">—</span>
            <span className="text-xs text-muted-foreground">{action}</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">{time}</span>
    </div>
);
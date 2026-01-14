"use client";

import { useState } from "react";
import { CalendarIcon, Filter, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";

export const ProcessFilters = () => {
    const [date, setDate] = useState<Date | undefined>();
    const [isAiActive, setIsAiActive] = useState(false);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Header com Busca e AI Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input
                        placeholder="Buscar por ID, título ou conteúdo..."
                        className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:inline">Modo Inteligente</span>
                    <Button
                        variant="outline"
                        size="sm"
                        className={`gap-2 border-slate-200 transition-all ${isAiActive ? 'bg-purple-50 border-purple-200 text-purple-700' : 'text-slate-600'}`}
                        onClick={() => setIsAiActive(!isAiActive)}
                    >
                        <Zap size={14} className={isAiActive ? "fill-purple-500 text-purple-500" : ""} />
                        Filtrar com IA
                    </Button>
                </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Filtros Avançados */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* 1. Setor / Categoria */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Setor</label>
                    <Select>
                        <SelectTrigger className="h-9 bg-slate-50 border-slate-200 text-xs">
                            <SelectValue placeholder="Todos os Setores" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os Setores</SelectItem>
                            <SelectItem value="compras">Compras</SelectItem>
                            <SelectItem value="juridico">Jurídico</SelectItem>
                            <SelectItem value="rh">Recursos Humanos</SelectItem>
                            <SelectItem value="financeiro">Financeiro</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 2. Responsável */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Responsável</label>
                    <Select>
                        <SelectTrigger className="h-9 bg-slate-50 border-slate-200 text-xs">
                            <SelectValue placeholder="Qualquer Usuário" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Qualquer Usuário</SelectItem>
                            <SelectItem value="carlos">Carlos Fin.</SelectItem>
                            <SelectItem value="ana">Ana Jur.</SelectItem>
                            <SelectItem value="ricardo">Ricardo Silva</SelectItem>
                            <SelectItem value="ia">IA Ordoc (Automático)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 3. Período */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Período de Criação</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={`w-full justify-start text-left font-normal h-9 bg-slate-50 border-slate-200 text-xs ${!date && "text-muted-foreground"}`}
                            >
                                <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                {date ? format(date, "P", { locale: ptBR }) : <span>Selecione uma data</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* 4. Tags / Status */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Status & Prioridade</label>
                    <Select>
                        <SelectTrigger className="h-9 bg-slate-50 border-slate-200 text-xs">
                            <SelectValue placeholder="Todos os Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os Status</SelectItem>
                            <SelectItem value="active">Em Execução</SelectItem>
                            <SelectItem value="intervention">Requer Intervenção</SelectItem>
                            <SelectItem value="completed">Concluídos</SelectItem>
                            <SelectItem value="high_priority">Alta Prioridade</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* AI Suggestion (Exemplo de Integração Futura) */}
            {isAiActive && (
                <div className="bg-purple-50 rounded-xl p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <Zap size={16} className="text-purple-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-purple-700">Sugestão da IA</p>
                        <p className="text-[11px] text-purple-600 leading-relaxed mt-0.5">
                            Notei que você costuma verificar os processos de <strong>Compras</strong> toda segunda-feira.
                            Filtrei <strong>3 certificações pendentes</strong> que vencem hoje.
                        </p>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="bg-white text-purple-700 border-purple-200 cursor-pointer hover:bg-purple-100">
                                Ver Apenas Críticos
                            </Badge>
                            <Badge variant="outline" className="bg-white text-purple-700 border-purple-200 cursor-pointer hover:bg-purple-100">
                                Limpar Filtros Inteligentes
                            </Badge>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

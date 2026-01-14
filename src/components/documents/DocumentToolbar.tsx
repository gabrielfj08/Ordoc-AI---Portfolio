"use client";

import * as React from "react";
import {
  ChevronDown, Folder, FileText, Table, Presentation,
  Video, FormInput, Image as ImageIcon, FileArchive,
  Mic, Mail, VideoIcon, Search, X,
  Database, Star, Trash2, History, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

// Interface para gerenciar o estado dos filtros
interface ToolbarProps {
  activeFilters?: string[];
  onClearFilters?: () => void;
  onFilterToggle?: (filter: string) => void;
}

export const DocumentToolbar = ({
  activeFilters = [],
  onClearFilters,
  onFilterToggle
}: ToolbarProps) => {
  const hasFilters = activeFilters.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">

        {/* Filtro: Tipo */}
        <FilterDropdown
          label="Tipo"
          isActive={activeFilters.includes("Tipo")}
          onSelect={() => onFilterToggle?.("Tipo")}
        >
          <TypeItem icon={Folder} label="Pastas" />
          <TypeItem icon={FileText} label="Documentos" />
          <TypeItem icon={Table} label="Planilhas" />
          <TypeItem icon={Presentation} label="Apresentações" />
          <TypeItem icon={Video} label="Vids" />
          <TypeItem icon={FormInput} label="Formulários" />
          <TypeItem icon={ImageIcon} label="Fotos e imagens" />
          <TypeItem icon={FileText} label="PDFs" color="text-red-500" />
          <TypeItem icon={FileArchive} label="Arquivos (.zip)" />
          <TypeItem icon={Mic} label="Áudio" />
        </FilterDropdown>

        {/* Filtro: Pessoas - Cor azul se ativo (Imagem ff62c4) */}
        <FilterDropdown
          label={activeFilters.includes("Pessoas") ? "Qualquer pessoa com the link" : "Pessoas"}
          isActive={activeFilters.includes("Pessoas")}
        >
          <div className="p-2 min-w-75" onClick={(e) => e.stopPropagation()}>
            <div className="relative mb-2 px-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Pesquisar pessoas e grupos"
                className="pl-9 h-9 bg-slate-50 border-none rounded-full focus-visible:ring-1 focus-visible:ring-blue-400"
              />
            </div>
            <div className="space-y-1">
              <PersonItem
                name="Ricardo Ferreira (eu)"
                email="ricardophg1@gmail.com"
                onSelect={() => onFilterToggle?.("Pessoas")}
              />
              <PersonItem
                name="Adsumtec Contato"
                email="contato@adsumtec.com.br"
                onSelect={() => onFilterToggle?.("Pessoas")}
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-3 py-2 px-3 cursor-pointer"
                onClick={() => onFilterToggle?.("Pessoas")}
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Search size={16} />
                </div>
                <span className="text-sm text-slate-700">Qualquer pessoa com o link</span>
              </DropdownMenuItem>
            </div>
          </div>
        </FilterDropdown>

        {/* Filtro: Local (Imagem ffcbc8) */}
        {activeFilters.includes("Local") && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 rounded-lg border-blue-200 bg-blue-50 text-blue-700 font-medium text-xs gap-2 px-3">
                Meu Drive <X size={14} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onFilterToggle?.("Local"); }} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60">
              <DropdownMenuItem className="gap-2"><Database size={16} /> Qualquer seção do Drive</DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-blue-600 bg-blue-50 font-medium"><CheckCircle2 size={16} /> Meu Drive</DropdownMenuItem>
              <DropdownMenuItem className="gap-2"><History size={16} /> Compartilhados comigo</DropdownMenuItem>
              <DropdownMenuItem className="gap-2"><Star size={16} /> Com estrela</DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-red-600"><Trash2 size={16} /> Na lixeira</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Filtro: Modificado */}
        <FilterDropdown
          label="Modificado"
          isActive={activeFilters.includes("Modificado")}
        >
          <DropdownMenuItem onClick={() => onFilterToggle?.("Modificado")}>Hoje</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterToggle?.("Modificado")}>Últimos sete dias</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Período personalizado</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-4 w-72">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-blue-600 uppercase">Depois de</label>
                  <Input type="date" className="h-9 border-blue-100" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" size="sm" className="text-blue-600 font-semibold">Cancelar</Button>
                  <Button size="sm" onClick={() => onFilterToggle?.("Modificado")} className="bg-blue-600 rounded-full px-4 font-semibold text-white">Aplicar</Button>
                </div>
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </FilterDropdown>

        {/* Filtro: Fonte */}
        <FilterDropdown label="Fonte" isActive={activeFilters.includes("Fonte")}>
          <DropdownMenuItem className="gap-3" onClick={() => onFilterToggle?.("Fonte")}>
            <Mail size={16} className="text-red-500" /> Gmail
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-3" onClick={() => onFilterToggle?.("Fonte")}>
            <VideoIcon size={16} className="text-green-600" /> Meet
          </DropdownMenuItem>
        </FilterDropdown>

        {/* Botão Limpar Filtros */}
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </div>


    </div>
  );
};

// --- Componentes Auxiliares ---

interface TypeItemProps {
  icon: React.ElementType;
  label: string;
  color?: string;
}

const TypeItem = ({ icon: Icon, label, color = "text-slate-500" }: TypeItemProps) => (
  <DropdownMenuItem className="gap-3 cursor-pointer py-2">
    <Icon size={18} className={color} />
    <span className="text-sm text-slate-700">{label}</span>
  </DropdownMenuItem>
);

interface FilterDropdownProps {
  label: string;
  children: React.ReactNode;
  isActive: boolean;
  onSelect?: () => void;
}

const FilterDropdown = ({ label, children, isActive, onSelect }: FilterDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        onClick={onSelect}
        className={`h-8 rounded-lg font-medium text-xs gap-2 px-3 transition-all ${isActive
          ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm"
          : "border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
      >
        {label}
        {isActive ? <X size={14} className="text-blue-500" /> : <ChevronDown size={14} className="text-slate-400" />}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      {children}
    </DropdownMenuContent>
  </DropdownMenu>
);

const PersonItem = ({ name, email, onSelect }: { name: string; email: string; onSelect: () => void }) => (
  <DropdownMenuSub>
    <DropdownMenuSubTrigger
      className="flex items-center justify-between p-2 hover:bg-slate-100 rounded-lg cursor-pointer group data-[state=open]:bg-slate-100"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
          {name.charAt(0)}
        </div>
        <div className="flex flex-col truncate max-w-45 text-left">
          <span className="text-sm font-medium text-slate-700 truncate">{name}</span>
          <span className="text-[10px] text-slate-400 truncate">{email}</span>
        </div>
      </div>
    </DropdownMenuSubTrigger>

    <DropdownMenuSubContent className="w-48 shadow-lg border-slate-200">
      <DropdownMenuItem onClick={onSelect}>Todos</DropdownMenuItem>
      <DropdownMenuItem onClick={onSelect}>Proprietário</DropdownMenuItem>
      <DropdownMenuItem onClick={onSelect}>Compartilhado com</DropdownMenuItem>
    </DropdownMenuSubContent>
  </DropdownMenuSub>
);
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  Search, Settings, HelpCircle, Grid, Sparkles,
  FileText, User, Map, Play, Mail, Video, Calendar, MessageCircle,
  HardDrive, LucideIcon, GitMerge, Shield, Users,
  Globe, Database, FileCheck, Webhook, FileSignature
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { VaultSelector } from "./VaultSelector";
import { NotificationCenter } from "@/components/processes/NotificationCenter";
import { AlertsIndicator } from "@/components/intelligence/AlertsIndicator";

const TopbarContent = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <nav className="w-full h-16 border-b border-border bg-white sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 lg:px-14">
      {/* Esquerda: Logo e Navegação */}
      <div className="flex items-center gap-10 shrink-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold italic">O</div>
          <span className="font-bold text-foreground text-lg">Ordoc</span>
        </div>

        <div className="hidden md:flex items-center gap-0.5 text-base font-semibold text-muted-foreground">
          <a
            href="/my-day"
            className={`px-3 py-1.5 rounded-full transition-colors ${pathname === "/my-day" ? "bg-orange-50 text-orange-600 font-bold" : "hover:border hover:border-orange-400"
              }`}
          >
            Meu Dia
          </a>

          <a
            href="/documents"
            className={`px-3 py-1.5 rounded-full transition-colors ${pathname === "/documents" ? "bg-orange-50 text-orange-600 font-bold" : "hover:border hover:border-orange-400"
              }`}
          >
            Documentos
          </a>

          <a
            href="/signature"
            className={`px-3 py-1.5 rounded-full transition-colors ${pathname === "/signature" ? "bg-orange-50 text-orange-600 font-bold" : "hover:border hover:border-orange-400"
              }`}
          >
            Assinatura
          </a>

          <a
            href="/processes"
            className={`px-3 py-1.5 rounded-full transition-colors ${pathname === "/processes" ? "bg-orange-50 text-orange-600 font-bold" : "hover:border hover:border-orange-400"
              }`}
          >
            Processos
          </a>

          <a
            href="/analytics"
            className={`px-3 py-1.5 rounded-full transition-colors ${pathname === "/analytics" ? "bg-orange-50 text-orange-600 font-bold" : "hover:border hover:border-orange-400"
              }`}
          >
            Análises
          </a>

          <a
            href="/insights"
            className={`px-3 py-1.5 rounded-full transition-colors ${pathname === "/insights" ? "bg-orange-50 text-orange-600 font-bold" : "hover:border hover:border-orange-400"
              }`}
          >
            IA
          </a>
        </div>
      </div>

      {/* Centro: Barra de Busca "IA" */}
      <div className="flex-1 max-w-xl px-8">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-orange-500 transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Busque em seus documentos..."
            className="w-full h-10 pl-12 pr-14 bg-muted border border-transparent focus:border-orange-200 focus:bg-white focus:ring-4 focus:ring-orange-50/50 rounded-full outline-none transition-all text-sm text-foreground placeholder:text-muted-foreground"
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('q')?.toString()}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {/* Badge IA */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className={`h-7 px-3 rounded-full flex items-center gap-1.5 cursor-pointer transition-all border ${isSearchFocused
              ? 'bg-orange-500 border-orange-500 text-white'
              : 'bg-transparent border-orange-300 text-orange-600 hover:border-orange-400'
              }`}>
              <Sparkles size={13} className={isSearchFocused ? 'fill-white' : 'fill-orange-600'} />
              <span className="text-xs font-bold">IA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Direita: Ícones e Perfil */}
      <div className="flex items-center gap-0 shrink-0 pl-2">
        {/* Indicador de Alertas de IA */}
        <AlertsIndicator />

        {/* Temporariamente desabilitado até backend estar conectado */}
        {/* <VaultSelector /> */}
        {/* <NotificationCenter /> */}

        {/* Menu Ajuda */}
        <div className="relative group">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground data-[state=open]:bg-accent p-1.5">
                <HelpCircle size={22} strokeWidth={2.5} className="size-[22px]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem className="cursor-pointer py-2.5">
                Ajuda
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2.5">
                Treinamento
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2.5">
                Termos e Política
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer py-2.5">
                Enviar feedback para o Google
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap z-[60]">
            Suporte
          </div>
        </div>

        {/* Menu Configurações */}
        <div className="relative group">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground data-[state=open]:bg-accent p-1.5">
                <Settings size={22} strokeWidth={2.5} className="size-[22px]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <Link href="/settings">
                <DropdownMenuItem className="cursor-pointer py-2.5">
                  <User size={16} className="mr-2" />
                  Perfil e Preferências
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href="/security">
                <DropdownMenuItem className="cursor-pointer py-2.5">
                  <Shield size={16} className="mr-2 text-orange-600" />
                  <div>
                    <p className="font-semibold">Central de Segurança</p>
                    <p className="text-xs text-muted-foreground">Soberania e controle de acesso</p>
                  </div>
                </DropdownMenuItem>
              </Link>
              <Link href="/team">
                <DropdownMenuItem className="cursor-pointer py-2.5">
                  <Users size={16} className="mr-2 text-blue-600" />
                  <div>
                    <p className="font-semibold">Gestão de Ecossistema</p>
                    <p className="text-xs text-muted-foreground">Time e governança</p>
                  </div>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap z-[60]">
            Configurações
          </div>
        </div>

        {/* Menu Ferramentas (Apps) */}
        <div className="relative group">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground data-[state=open]:bg-accent p-1.5">
                <Grid size={22} strokeWidth={2.5} className="size-[22px]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-4">
              <div className="grid grid-cols-3 gap-y-3 gap-x-2">
                {/* Integrações de API */}
                <AppItem icon={Globe} label="Gov.br" color="text-blue-600" />
                <AppItem icon={Database} label="Receita Federal" color="text-green-600" />
                <AppItem icon={FileCheck} label="Cartórios" color="text-purple-600" />
                <AppItem icon={Database} label="ERP" color="text-orange-600" />
                <AppItem icon={Webhook} label="Webhooks" color="text-muted-foreground" />
                <AppItem icon={FileSignature} label="Assinatura" color="text-[#f97316]" />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap z-[60]">
            Ferramentas
          </div>
        </div>

        {/* Separador */}
        <div className="h-6 w-px bg-slate-300 mx-2" />

        <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm cursor-pointer hover:shadow-md transition-all" title="Conta do Google: Ana Silva">
          AS
        </div>
      </div>
    </nav>
  );
};

const AppItem = ({ icon: Icon, label, color }: { icon: LucideIcon, label: string, color: string }) => (
  <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-accent p-2 rounded-xl transition-colors group">
    <Icon size={24} className={`${color} group-hover:scale-110 transition-transform`} />
    <span className="text-xs text-muted-foreground font-medium">{label}</span>
  </div>
);

export const Topbar = () => {
  return (
    <Suspense fallback={<div className="w-full h-16 bg-white border-b border-border" />}>
      <TopbarContent />
    </Suspense>
  );
};
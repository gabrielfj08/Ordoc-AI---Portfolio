// src/app/(dashboard)/my-day/page.tsx
import { MainContainer } from "@/components/layout/MainContainer";
import { StatsCards } from "@/components/my-day/StatsCards";
import { AssistantCard } from "@/components/my-day/AssistantCard";
import { PriorityTasks } from "@/components/my-day/PriorityTasks";
import { ProcessStatus } from "@/components/my-day/ProcessStatus";
import { StorageCard } from "@/components/my-day/StorageCard";
import { Agenda } from "@/components/my-day/Agenda";
import { IARecommendations } from "@/components/my-day/IARecommendations";
import { AIInsightsCard } from "@/components/my-day/AIInsightsCard";
import { TeamView } from "@/components/my-day/TeamView";
import { FeaturedDocuments } from "@/components/my-day/FeaturedDocuments";
import { LGPDCompliance } from "@/components/my-day/LGPDCompliance";
import { ResumeWorkCard } from "@/components/my-day/ResumeWorkCard";
import { OngoingProcessesCard } from "@/components/my-day/OngoingProcessesCard";

export default function MyDayPage() {
  return (
    <MainContainer>
      {/* SEÇÃO DE BOAS-VINDAS: Centralização Vertical e Destaques em Laranja Ordoc */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-12 w-full items-center">
        
        {/* Bloco de texto centralizado verticalmente */}
        <div className="lg:col-span-2 flex flex-col justify-center"> 
          <p className="text-slate-400 text-sm md:text-base mb-1 font-medium italic tracking-wide">
            Quinta-Feira, 08 de Janeiro de 2026
          </p>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-800 tracking-tighter leading-[0.9] py-1">
            Boa noite, Ana
          </h1>
          
          {/* Aplicando o laranja via classe arbitrária para garantir que assuma a cor */}
          <p className="text-slate-500 mt-4 text-xl md:text-2xl leading-relaxed">
            Você tem <span className="text-[#f97316] font-bold">0 documentos</span> aguardando assinatura e 
            <span className="text-[#f97316] font-bold"> 39 aprovações pendentes</span>.
          </p>
        </div>

        <div className="lg:col-span-2 w-full">
          <AssistantCard />
        </div>
      </div>

      {/* MÉTRICAS: Grid de 4 colunas que dita a régua de alinhamento do topo */}
      <StatsCards /> 
      
      {/* CONTEÚDO PRINCIPAL EM DUAS COLUNAS */}
      <div className="flex flex-col xl:flex-row gap-8 items-start w-full mt-10">

        {/* Coluna Esquerda: Fluxo de Trabalho, Documentos e IA (Expansível) */}
        <div className="flex-1 space-y-8 w-full text-foreground">
            <AIInsightsCard />
            <ProcessStatus />
            <FeaturedDocuments />

            {/* Novos Cards Lado a Lado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ResumeWorkCard /> {/* Componente "Continue de onde parou" */}
                <OngoingProcessesCard /> {/* Componente "Processos em Andamento" */}
            </div>

            <PriorityTasks tasks={[]} />
            <LGPDCompliance />
        </div>
        
        {/* Coluna Direita: Painel de Apoio, Contexto e Equipe (Largura Fixa) */}
        <div className="w-full xl:w-80 2xl:w-96 space-y-6 shrink-0">
            <StorageCard />
            <TeamView />
            <Agenda />
            <IARecommendations />
        </div>
      </div>
    </MainContainer>
  );
}
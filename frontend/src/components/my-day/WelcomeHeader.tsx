// src/components/my-day/WelcomeHeader.tsx
import { AssistantCard } from "./AssistantCard";

export const WelcomeHeader = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10">
      {/* Lado Esquerdo: Textos de Boas-vindas */}
      <div className="flex-1">
        <p className="text-muted-foreground text-xs mb-1 font-medium">
          Quinta-Feira, 08 de Janeiro de 2026
        </p>
        <h1 className="text-5xl font-bold text-foreground tracking-tight leading-tight">
          Boa noite, Ana
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Você tem <span className="text-primary font-semibold">0 documentos</span> aguardando assinatura e
          <span className="text-primary font-semibold"> 39 aprovações pendentes</span>.
        </p>
      </div>

      {/* Lado Direito: Card do Assistente Ordoc-AI */}
      <div className="w-full lg:max-w-xl shrink-0">
        <AssistantCard />
      </div>
    </div>
  );
};
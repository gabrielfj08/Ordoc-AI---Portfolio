// src/components/my-day/LGPDCompliance.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const LGPDCompliance = () => {
  return (
    <Card className="border-none shadow-sm bg-card overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between pb-6">
        <div className="flex gap-3">
          <div className="p-2 bg-orange-50 rounded-lg text-primary">
            🛡️
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-foreground">Conformidade LGPD</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Monitoramento de proteção de dados</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100 font-bold px-3 py-1">
          Em Conformidade
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Sub-cards de métricas inteligentes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-border bg-slate-50/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary text-xs">📈</span>
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Score de Privacidade</h4>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-foreground">98/100</span>
              <span className="text-[10px] text-green-600 font-bold mt-1">+2 pontos esta semana</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-slate-50/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary text-xs">📄</span>
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Consentimentos</h4>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-foreground">1,245</span>
              <span className="text-[10px] text-muted-foreground font-medium mt-1">Registros ativos</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-red-100 bg-red-50/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-destructive text-xs">⚠️</span>
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pendências</h4>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-destructive">0</span>
              <span className="text-[10px] text-muted-foreground font-medium mt-1">Ações críticas</span>
            </div>
          </div>
        </div>

        {/* Botões de Ação na Base */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button className="w-full text-xs font-semibold border-2 border-orange-300 text-orange-500 bg-transparent hover:bg-orange-500 hover:text-white antialiased transition-all py-6">
            Ver Relatório DPO
          </Button>
          <Button className="w-full text-xs font-semibold border-2 border-orange-300 text-orange-500 bg-transparent hover:bg-orange-500 hover:text-white antialiased transition-all py-6">
            Mapeamento de Dados
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
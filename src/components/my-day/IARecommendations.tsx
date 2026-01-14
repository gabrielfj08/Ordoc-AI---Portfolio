// src/components/my-day/IARecommendations.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, CheckCircle2 } from "lucide-react";

const alerts = [
  {
    id: 1,
    text: 'Detectamos ausência de cláusula de rescisão antecipada em 3 novos arquivos.',
    action: "Adicionar tags",
    type: "risk",
    actionLabel: "Aplicar Cláusula Padrão",
    impact: "Alto Risco"
  },
  {
    id: 2,
    text: 'Detectado vencimento próximo no contrato "Empresa XYZ".',
    action: "Ver contrato",
    type: "warning",
    actionLabel: "Verificar Contrato",
    impact: "Atenção"
  }
];

export const IARecommendations = () => {
  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <span className="text-orange-600 font-bold text-lg">🛡️</span>
          <CardTitle className="text-sm font-semibold text-foreground">Mitigação de Riscos</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="p-3 rounded-xl bg-orange-50/50 border border-orange-100 group hover:bg-orange-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${alert.type === 'risk' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                {alert.impact}
              </span>
              {alert.type === 'risk' && <ShieldAlert size={14} className="text-red-500" />}
            </div>

            <p className="text-xs text-foreground leading-snug font-medium mb-3">
              {alert.text}
            </p>

            <Button size="sm" className="w-full h-7 text-xs border-2 border-orange-300 text-orange-500 bg-transparent hover:bg-orange-500 hover:text-white transition-all font-semibold antialiased">
              {alert.type === 'risk' ? <CheckCircle2 size={12} className="mr-1.5" /> : null}
              {alert.actionLabel}
            </Button>
          </div>
        ))}
        <div className="p-2 text-center">
          <span className="text-xs text-muted-foreground font-medium cursor-pointer hover:text-foreground transition-colors">Ver todos os 5 indícios</span>
        </div>
      </CardContent>
    </Card>
  );
};
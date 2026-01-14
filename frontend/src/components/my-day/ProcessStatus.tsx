// src/components/my-day/ProcessStatus.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const ProcessStatus = () => {
  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-bold">⛓️</span>
          <CardTitle className="text-lg font-semibold text-foreground">Estado dos Processos</CardTitle>
        </div>
        <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full font-bold uppercase">Carga Moderada</span>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl border border-red-50 bg-red-50/20">
            <span className="text-3xl font-bold text-red-600">5</span>
            <p className="text-xs text-muted-foreground font-bold uppercase mt-1">Urgente</p>
          </div>
          <div className="p-4 rounded-xl border border-orange-50 bg-orange-50/20">
            <span className="text-3xl font-bold text-orange-600">16</span>
            <p className="text-xs text-muted-foreground font-bold uppercase mt-1">Normal</p>
          </div>
          <div className="p-4 rounded-xl border border-green-50 bg-green-50/20">
            <span className="text-3xl font-bold text-green-600">2</span>
            <p className="text-xs text-muted-foreground font-bold uppercase mt-1">Concluídas</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground">Progresso geral</span>
            <span className="text-foreground font-bold">9%</span>
          </div>
          <Progress value={9} className="h-2 bg-muted" />
          <div className="flex justify-between text-xs text-muted-foreground font-medium">
            <span>21 de 23 processos em andamento</span>
            <span>Previsão: 3 dias</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
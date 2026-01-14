// src/components/my-day/StatsCards.tsx
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Documentos Processados", value: "2", change: "+12%", icon: "📄", color: "text-orange-600" },
  { label: "Alertas de Inteligência", value: "7", change: "+5%", icon: "🔔", color: "text-red-500" },
  { label: "Status da Plataforma", value: "Online", change: "100%", icon: "⚡", color: "text-green-500" },
  { label: "Padrões Identificados", value: "4", change: "+3", icon: "✨", color: "text-blue-500" },
];

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
      {stats.map((item, i) => (
        <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className={`text-2xl ${item.color}`}>{item.icon}</span>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {item.change}
              </span>
            </div>
            <h3 className="text-4xl font-bold text-foreground tracking-tight">{item.value}</h3>
            <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">{item.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
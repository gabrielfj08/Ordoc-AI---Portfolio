// src/components/my-day/TeamView.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const team = [
  { name: "Ana Silva", status: "online", tasks: "1 tarefas atrasadas", color: "bg-primary" },
  { name: "Ricardo M.", status: "offline", tasks: "0 tarefas", color: "bg-slate-300" },
];

export const TeamView = () => {
  return (
    <Card className="border-none shadow-sm bg-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <span className="text-primary">👥</span>
          <CardTitle className="text-sm font-semibold text-foreground">Visão da Equipe</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Resumo rápido dos membros</p>
        <div className="space-y-3">
          {team.map((member, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${member.color} text-primary-foreground flex items-center justify-center font-bold text-[10px]`}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="font-medium text-foreground">{member.name}</span>
              </div>
              <span className={member.tasks.includes("atrasadas") ? "text-destructive font-bold" : "text-muted-foreground"}>
                {member.tasks}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Interface para simular os dados inteligentes vindos do Backend
interface Task {
  id: string;
  title: string;
  deadline: string;
  priority: 'ALTA' | 'NORMAL';
  status: string;
  score: number; // Score de urgência calculado pela IA
}

export const PriorityTasks = ({ tasks }: { tasks: Task[] }) => {
  return (
    <Card className="border-none shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-orange-100 rounded-lg text-orange-600">🔥</span>
          <CardTitle className="text-lg font-semibold text-foreground">
            Tarefas Prioritárias
          </CardTitle>
        </div>
        <span className="text-xs text-muted-foreground">Ordenadas por urgência (IA)</span>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-orange-100 transition-all bg-muted/30"
          >
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border font-bold text-muted-foreground">
                {task.id}
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">{task.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-red-500 font-medium">🕒 {task.deadline}</span>
                  <Badge variant="destructive" className="text-xs px-1.5 py-0 bg-red-500">
                    {task.priority}
                  </Badge>
                </div>
              </div>
            </div>

            {/* O Score de Urgência que define a posição no layout dinâmico */}
            <div className="text-right">
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                {task.score}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
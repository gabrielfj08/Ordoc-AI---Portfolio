import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const StorageCard = () => {
  const usedStorage = 0.1887;
  const totalStorage = 100;
  const progressValue = (usedStorage / totalStorage) * 100;

  return (
    <Card className="border-none shadow-sm bg-white">
      {/* Correção da Tag: CardHeader fechando corretamente */}
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <span className="text-purple-600">🗄️</span>
          <CardTitle className="text-sm font-semibold text-foreground">
            Armazenamento
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-foreground">188.7 MB</span>
          <span className="text-xs text-muted-foreground font-medium">de 100 GB</span>
        </div>

        <Progress value={progressValue} className="h-2 bg-muted" />

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-muted-foreground">Documentos (29)</span>
            </div>
            <span className="font-semibold text-foreground">68.6 MB</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400" />
              <span className="text-muted-foreground">Lixeira (50)</span>
            </div>
            <span className="font-semibold text-foreground">120.1 MB</span>
          </div>
        </div>

        <Button className="w-full text-xs border-2 border-orange-300 text-orange-500 bg-transparent hover:bg-orange-500 hover:text-white font-semibold antialiased transition-all">
          Gerenciar documentos
        </Button>
      </CardContent>
    </Card>
  );
};
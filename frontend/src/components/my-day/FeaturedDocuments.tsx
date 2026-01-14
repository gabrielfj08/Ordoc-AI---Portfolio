// src/components/my-day/FeaturedDocuments.tsx


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const FeaturedDocuments = () => {
  return (
    <Card className="border-none shadow-sm bg-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <span className="text-primary">📄</span>
          <CardTitle className="text-lg font-semibold">Documentos em Destaque</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="xs" className="text-muted-foreground font-bold">
            FILTRAR
          </Button>
          <Button variant="link" size="xs" className="font-bold">
            VER TODOS
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/50">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-background rounded-lg shadow-sm">📄</div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Procuração_Ad_Judicia.pdf</h4>
              <p className="text-xs text-muted-foreground">Recentemente editado • 4.6 MB</p>
            </div>
          </div>
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
            80% RELEVÂNCIA
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
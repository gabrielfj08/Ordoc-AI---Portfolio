import React from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gavel, Bell, Calendar, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function CourtMovementsWidget() {
    return (
        <Card className="p-6 border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Gavel className="size-5 text-primary" />
                        Movimentações Processuais
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Integração TJ/Tribunais Superiores</p>
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                    <div className="size-1.5 rounded-full bg-success mr-2" />
                    Sincronizado há 10 min
                </Badge>
            </div>

            <div className="space-y-4">
                {[
                    { id: 1, court: 'TJSP', process: '1002345-88.2024.8.26.0100', type: 'Decisão', date: 'Hoje, 10:30', urgent: true },
                    { id: 2, court: 'STJ', process: 'REsp 1.234.567', type: 'Intimação', date: 'Ontem, 16:45', urgent: false },
                    { id: 3, court: 'TRT-2', process: '0054321-12.2023.5.02.0000', type: 'Movimentação', date: 'Ontem, 09:15', urgent: false },
                ].map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/50 cursor-pointer group">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            {item.urgent ? <Bell className="size-5 text-destructive animate-pulse" /> : <Gavel className="size-5 text-primary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-sm truncate">{item.process}</span>
                                <Badge variant={item.urgent ? "destructive" : "outline"} className="text-[10px] h-5">
                                    {item.court}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="font-medium text-foreground">{item.type}</span>
                                <span>•</span>
                                <Calendar className="size-3" />
                                <span>{item.date}</span>
                            </div>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>

            <Button variant="ghost" className="w-full mt-4 text-xs text-primary hover:text-primary/80">
                Ver todas movimentações
            </Button>
        </Card>
    )
}

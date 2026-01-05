import React from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, Highlighter, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function OfficialDiariesWidget() {
    return (
        <Card className="p-6 border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <BookOpen className="size-5 text-primary" />
                        Diários Oficiais
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Monitoramento de termos e nomes</p>
                </div>
                <Button size="icon" variant="ghost" className="size-8">
                    <Search className="size-4" />
                </Button>
            </div>

            <div className="space-y-4">
                {[
                    { id: 1, source: 'DOU', section: 'Seção 1', term: 'Portaria Nº 123', context: '...designa o servidor para cargo em comissão...', date: 'Hoje' },
                    { id: 2, source: 'DOE-SP', section: 'Executivo I', term: 'Adsumtec', context: '...contratação da empresa Adsumtec Tecnologia...', date: 'Ontem' },
                ].map((item) => (
                    <div key={item.id} className="p-4 rounded-lg bg-secondary/20 border border-border/50 hover:border-primary/30 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-background">{item.source}</Badge>
                                <span className="text-xs text-muted-foreground">{item.section}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <Highlighter className="size-3 text-yellow-500" />
                            <span className="text-sm font-semibold">Termo: "{item.term}"</span>
                        </div>
                        <p className="text-xs text-muted-foreground italic line-clamp-2">
                            "{item.context}"
                        </p>
                        <div className="flex justify-end mt-2">
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs gap-1">
                                Ler publicação <ExternalLink className="size-3" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

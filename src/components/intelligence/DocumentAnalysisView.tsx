'use client';

import { useState } from 'react';
import {
    Brain,
    Users,
    CheckCircle2,
    AlertTriangle,
    Lightbulb,
    Clock,
    BarChart3,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalysisResult, CouncilOpinion } from '@/services/intelligence';
import { cn } from '@/lib/utils';

interface DocumentAnalysisViewProps {
    analysis: AnalysisResult;
    className?: string;
}

function OpinionCard({ opinion }: { opinion: CouncilOpinion }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Brain className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <CardTitle className="text-base">{opinion.member_domain}</CardTitle>
                            <CardDescription className="text-xs">
                                Confiança: {(opinion.confidence * 100).toFixed(0)}%
                            </CardDescription>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                </div>
                <Progress value={opinion.confidence * 100} className="h-2 mt-2" />
            </CardHeader>

            {isExpanded && (
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm font-medium mb-2">Análise:</p>
                        <p className="text-sm text-muted-foreground">{opinion.analysis}</p>
                    </div>

                    {opinion.key_findings && opinion.key_findings.length > 0 && (
                        <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                Principais Descobertas:
                            </p>
                            <ul className="space-y-1">
                                {opinion.key_findings.map((finding, idx) => (
                                    <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                        <span>•</span>
                                        <span>{finding}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {opinion.concerns && opinion.concerns.length > 0 && (
                        <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                Preocupações:
                            </p>
                            <ul className="space-y-1">
                                {opinion.concerns.map((concern, idx) => (
                                    <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                        <span>•</span>
                                        <span>{concern}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {opinion.recommendations && opinion.recommendations.length > 0 && (
                        <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-blue-600" />
                                Recomendações:
                            </p>
                            <ul className="space-y-1">
                                {opinion.recommendations.map((rec, idx) => (
                                    <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                        <span>•</span>
                                        <span>{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
}

export function DocumentAnalysisView({ analysis, className }: DocumentAnalysisViewProps) {
    const { deliberation, extraction } = analysis;

    const consensusColor =
        deliberation?.consensus_level === 'high' ? 'text-green-600' :
        deliberation?.consensus_level === 'medium' ? 'text-amber-600' :
        'text-red-600';

    const consensusBg =
        deliberation?.consensus_level === 'high' ? 'bg-green-50' :
        deliberation?.consensus_level === 'medium' ? 'bg-amber-50' :
        'bg-red-50';

    return (
        <div className={cn('space-y-6', className)}>
            {/* Resumo do Council */}
            {deliberation && (
                <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-600 rounded-lg">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle>Deliberação do Conselho de IA</CardTitle>
                                    <CardDescription>
                                        Análise colaborativa de {deliberation.member_opinions?.length || 0} especialistas
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={cn('px-3 py-1 rounded-full text-sm font-medium', consensusBg, consensusColor)}>
                                    Consenso: {deliberation.consensus_level}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {deliberation.total_processing_time_ms?.toFixed(0)}ms
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Categoria e Confiança */}
                        {deliberation.final_category && (
                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                                <div>
                                    <p className="text-sm text-muted-foreground">Categoria Identificada</p>
                                    <p className="text-lg font-semibold">{deliberation.final_category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Confiança</p>
                                    <p className="text-lg font-semibold">{(deliberation.confidence_score * 100).toFixed(0)}%</p>
                                </div>
                            </div>
                        )}

                        {/* Resumo */}
                        <div>
                            <p className="text-sm font-medium mb-2">Resumo:</p>
                            <p className="text-sm text-muted-foreground">{deliberation.summary}</p>
                        </div>

                        {/* Pontos-chave */}
                        {deliberation.key_points && deliberation.key_points.length > 0 && (
                            <div>
                                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    Pontos-Chave:
                                </p>
                                <ul className="space-y-1">
                                    {deliberation.key_points.map((point, idx) => (
                                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                            <span>•</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Preocupações */}
                        {deliberation.concerns && deliberation.concerns.length > 0 && (
                            <div>
                                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                                    Preocupações:
                                </p>
                                <ul className="space-y-1">
                                    {deliberation.concerns.map((concern, idx) => (
                                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                            <span>•</span>
                                            <span>{concern}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Recomendações */}
                        {deliberation.recommendations && deliberation.recommendations.length > 0 && (
                            <div>
                                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                    <Lightbulb className="h-4 w-4 text-blue-600" />
                                    Recomendações:
                                </p>
                                <ul className="space-y-1">
                                    {deliberation.recommendations.map((rec, idx) => (
                                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                            <span>•</span>
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Detalhes por Especialista */}
            {deliberation?.member_opinions && deliberation.member_opinions.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Opiniões dos Especialistas
                    </h3>
                    <div className="grid gap-4">
                        {deliberation.member_opinions.map((opinion, idx) => (
                            <OpinionCard key={idx} opinion={opinion} />
                        ))}
                    </div>
                </div>
            )}

            {/* Dados Extraídos */}
            {extraction && Object.keys(extraction).length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Dados Extraídos</CardTitle>
                        <CardDescription>Informações estruturadas identificadas no documento</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="parties">
                            <TabsList>
                                {extraction.parties && extraction.parties.length > 0 && (
                                    <TabsTrigger value="parties">Partes ({extraction.parties.length})</TabsTrigger>
                                )}
                                {extraction.dates && extraction.dates.length > 0 && (
                                    <TabsTrigger value="dates">Datas ({extraction.dates.length})</TabsTrigger>
                                )}
                                {extraction.values && extraction.values.length > 0 && (
                                    <TabsTrigger value="values">Valores ({extraction.values.length})</TabsTrigger>
                                )}
                                {extraction.clauses && extraction.clauses.length > 0 && (
                                    <TabsTrigger value="clauses">Cláusulas ({extraction.clauses.length})</TabsTrigger>
                                )}
                            </TabsList>

                            {extraction.parties && extraction.parties.length > 0 && (
                                <TabsContent value="parties" className="space-y-2">
                                    {extraction.parties.map((party, idx) => (
                                        <div key={idx} className="p-3 bg-muted rounded-lg">
                                            <p className="font-medium">{party.name}</p>
                                            <p className="text-sm text-muted-foreground">{party.role}</p>
                                            {party.identification && (
                                                <p className="text-sm text-muted-foreground">{party.identification}</p>
                                            )}
                                        </div>
                                    ))}
                                </TabsContent>
                            )}

                            {extraction.dates && extraction.dates.length > 0 && (
                                <TabsContent value="dates" className="space-y-2">
                                    {extraction.dates.map((date, idx) => (
                                        <div key={idx} className="p-3 bg-muted rounded-lg">
                                            <p className="font-medium">{date.type}</p>
                                            <p className="text-sm">{date.date}</p>
                                            {date.description && (
                                                <p className="text-sm text-muted-foreground">{date.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </TabsContent>
                            )}

                            {extraction.values && extraction.values.length > 0 && (
                                <TabsContent value="values" className="space-y-2">
                                    {extraction.values.map((value, idx) => (
                                        <div key={idx} className="p-3 bg-muted rounded-lg">
                                            <p className="font-medium">{value.type}</p>
                                            <p className="text-sm">
                                                {value.currency} {value.amount.toLocaleString()}
                                            </p>
                                            {value.description && (
                                                <p className="text-sm text-muted-foreground">{value.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </TabsContent>
                            )}

                            {extraction.clauses && extraction.clauses.length > 0 && (
                                <TabsContent value="clauses" className="space-y-2">
                                    {extraction.clauses.map((clause, idx) => (
                                        <div key={idx} className="p-3 bg-muted rounded-lg">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-medium">{clause.type}</p>
                                                <Badge variant={
                                                    clause.importance === 'high' ? 'destructive' :
                                                    clause.importance === 'medium' ? 'default' : 'secondary'
                                                }>
                                                    {clause.importance}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{clause.content}</p>
                                        </div>
                                    ))}
                                </TabsContent>
                            )}
                        </Tabs>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

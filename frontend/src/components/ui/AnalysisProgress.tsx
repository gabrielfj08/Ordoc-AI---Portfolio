'use client';

/**
 * AnalysisProgress - Shows analysis progress with steps
 */

import React from 'react';
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from './progress';

export type AnalysisStep =
    | 'extraction'
    | 'classification'
    | 'council'
    | 'patterns'
    | 'alerts';

interface StepConfig {
    label: string;
    description: string;
}

const stepConfigs: Record<AnalysisStep, StepConfig> = {
    extraction: {
        label: 'Extração',
        description: 'Identificando entidades no documento',
    },
    classification: {
        label: 'Classificação',
        description: 'Categorizando o tipo de documento',
    },
    council: {
        label: 'Análise do Council',
        description: 'Especialistas analisando o conteúdo',
    },
    patterns: {
        label: 'Padrões',
        description: 'Verificando padrões aprendidos',
    },
    alerts: {
        label: 'Alertas',
        description: 'Gerando alertas proativos',
    },
};

interface AnalysisProgressProps {
    currentStep: AnalysisStep | null;
    completedSteps: AnalysisStep[];
    failedStep?: AnalysisStep;
    progress?: number;
    className?: string;
}

export function AnalysisProgress({
    currentStep,
    completedSteps,
    failedStep,
    progress,
    className,
}: AnalysisProgressProps) {
    const steps: AnalysisStep[] = ['extraction', 'classification', 'council', 'patterns', 'alerts'];

    const totalProgress = progress ?? Math.round(
        ((completedSteps.length + (currentStep ? 0.5 : 0)) / steps.length) * 100
    );

    return (
        <div className={cn('space-y-4', className)}>
            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso da análise</span>
                    <span className="font-medium">{totalProgress}%</span>
                </div>
                <Progress value={totalProgress} className="h-2" />
            </div>

            {/* Steps */}
            <div className="space-y-2">
                {steps.map((step) => {
                    const config = stepConfigs[step];
                    const isCompleted = completedSteps.includes(step);
                    const isCurrent = currentStep === step;
                    const isFailed = failedStep === step;
                    const isPending = !isCompleted && !isCurrent && !isFailed;

                    return (
                        <div
                            key={step}
                            className={cn(
                                'flex items-center gap-3 p-2 rounded-lg transition-colors',
                                isCurrent && 'bg-primary/10',
                                isCompleted && 'opacity-60'
                            )}
                        >
                            {isCompleted ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            ) : isCurrent ? (
                                <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0" />
                            ) : isFailed ? (
                                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                            ) : (
                                <Circle className="h-5 w-5 text-muted-foreground/40 flex-shrink-0" />
                            )}

                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    'text-sm font-medium',
                                    isPending && 'text-muted-foreground',
                                    isFailed && 'text-red-600 dark:text-red-400'
                                )}>
                                    {config.label}
                                </p>
                                <p className={cn(
                                    'text-xs',
                                    isPending ? 'text-muted-foreground/60' : 'text-muted-foreground'
                                )}>
                                    {config.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default AnalysisProgress;

'use client';

/**
 * AlertBanner - Component for displaying proactive alerts
 * 
 * Shows AI-generated alerts with severity indicators and action buttons.
 */

import React from 'react';
import { AlertCircle, AlertTriangle, Info, XCircle, Check, X, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import type { ProactiveAlert, SuggestedAction } from '@/services/intelligence';

interface AlertBannerProps {
    alert: ProactiveAlert;
    onAccept?: (alert: ProactiveAlert) => void;
    onReject?: (alert: ProactiveAlert) => void;
    onModify?: (alert: ProactiveAlert) => void;
    onDismiss?: (alert: ProactiveAlert) => void;
    showActions?: boolean;
    className?: string;
}

const severityConfig = {
    info: {
        icon: Info,
        bgColor: 'bg-blue-50 dark:bg-blue-950',
        borderColor: 'border-blue-200 dark:border-blue-800',
        iconColor: 'text-blue-600 dark:text-blue-400',
        textColor: 'text-blue-800 dark:text-blue-200',
    },
    warning: {
        icon: AlertTriangle,
        bgColor: 'bg-amber-50 dark:bg-amber-950',
        borderColor: 'border-amber-200 dark:border-amber-800',
        iconColor: 'text-amber-600 dark:text-amber-400',
        textColor: 'text-amber-800 dark:text-amber-200',
    },
    error: {
        icon: AlertCircle,
        bgColor: 'bg-red-50 dark:bg-red-950',
        borderColor: 'border-red-200 dark:border-red-800',
        iconColor: 'text-red-600 dark:text-red-400',
        textColor: 'text-red-800 dark:text-red-200',
    },
    critical: {
        icon: XCircle,
        bgColor: 'bg-purple-50 dark:bg-purple-950',
        borderColor: 'border-purple-200 dark:border-purple-800',
        iconColor: 'text-purple-600 dark:text-purple-400',
        textColor: 'text-purple-800 dark:text-purple-200',
    },
};

const alertTypeLabels = {
    compliance: 'Conformidade',
    pattern: 'Padrão Detectado',
    suggestion: 'Sugestão',
    error: 'Erro',
};

export function AlertBanner({
    alert,
    onAccept,
    onReject,
    onModify,
    onDismiss,
    showActions = true,
    className,
}: AlertBannerProps) {
    const config = severityConfig[alert.severity];
    const Icon = config.icon;

    const isPending = alert.user_response === 'pending';

    return (
        <div
            className={cn(
                'rounded-lg border p-4 transition-all duration-200',
                config.bgColor,
                config.borderColor,
                className
            )}
            role="alert"
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={cn('flex-shrink-0 mt-0.5', config.iconColor)}>
                    <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className={cn('text-xs font-medium uppercase tracking-wider', config.textColor)}>
                            {alertTypeLabels[alert.alert_type]}
                        </span>
                        {!isPending && (
                            <span className={cn(
                                'text-xs px-2 py-0.5 rounded-full',
                                alert.user_response === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                    alert.user_response === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            )}>
                                {alert.user_response === 'accepted' ? 'Aceito' :
                                    alert.user_response === 'rejected' ? 'Rejeitado' : 'Modificado'}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h4 className={cn('font-semibold text-sm', config.textColor)}>
                        {alert.title}
                    </h4>

                    {/* Message */}
                    <p className={cn('text-sm mt-1 opacity-90', config.textColor)}>
                        {alert.message}
                    </p>

                    {/* Suggested Actions */}
                    {alert.suggested_actions && alert.suggested_actions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {alert.suggested_actions.map((action, index) => (
                                <SuggestedActionButton
                                    key={index}
                                    action={action}
                                    disabled={!isPending}
                                />
                            ))}
                        </div>
                    )}

                    {/* Action Buttons */}
                    {showActions && isPending && (
                        <div className="mt-3 flex items-center gap-2">
                            {onAccept && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs bg-green-50 hover:bg-green-100 border-green-300 text-green-700 dark:bg-green-950 dark:hover:bg-green-900 dark:border-green-700 dark:text-green-300"
                                    onClick={() => onAccept(alert)}
                                >
                                    <Check className="h-3 w-3 mr-1" />
                                    Aceitar
                                </Button>
                            )}
                            {onReject && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs bg-red-50 hover:bg-red-100 border-red-300 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-700 dark:text-red-300"
                                    onClick={() => onReject(alert)}
                                >
                                    <X className="h-3 w-3 mr-1" />
                                    Rejeitar
                                </Button>
                            )}
                            {onModify && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                    onClick={() => onModify(alert)}
                                >
                                    <Edit className="h-3 w-3 mr-1" />
                                    Modificar
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Dismiss */}
                {onDismiss && (
                    <button
                        onClick={() => onDismiss(alert)}
                        className={cn(
                            'flex-shrink-0 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors',
                            config.textColor
                        )}
                        aria-label="Dispensar alerta"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

function SuggestedActionButton({ action, disabled }: { action: SuggestedAction; disabled?: boolean }) {
    return (
        <button
            disabled={disabled}
            className={cn(
                'text-xs px-2 py-1 rounded border transition-colors',
                'bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600',
                'hover:bg-white dark:hover:bg-black/40',
                'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            title={action.description}
        >
            {action.label}
        </button>
    );
}

export default AlertBanner;

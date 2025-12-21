'use client';

/**
 * useIntelligence - Hook for document intelligence analysis
 */

import { useState, useCallback } from 'react';
import intelligenceService, {
    ProactiveAlert,
    AnalysisResult,
    AnalysisRequest,
    ExtractedEntity,
} from '@/services/intelligence';

export interface UseIntelligenceOptions {
    onAnalysisComplete?: (result: AnalysisResult) => void;
    onError?: (error: Error) => void;
    onAlertResponse?: (alert: ProactiveAlert) => void;
}

export interface UseIntelligenceReturn {
    // State
    analyzing: boolean;
    alerts: ProactiveAlert[];
    entities: Record<string, ExtractedEntity[]>;
    analysisResult: AnalysisResult | null;
    error: Error | null;

    // Actions
    analyzeDocument: (request: AnalysisRequest) => Promise<AnalysisResult | null>;
    extractEntities: (text: string, entityTypes: string[]) => Promise<Record<string, ExtractedEntity[]> | null>;
    loadAlerts: (documentId?: string) => Promise<void>;
    acceptAlert: (alert: ProactiveAlert) => Promise<void>;
    rejectAlert: (alert: ProactiveAlert) => Promise<void>;
    modifyAlert: (alert: ProactiveAlert, modifications: Record<string, unknown>) => Promise<void>;
    clearAlerts: () => void;
    reset: () => void;
}

export function useIntelligence(options: UseIntelligenceOptions = {}): UseIntelligenceReturn {
    const [analyzing, setAnalyzing] = useState(false);
    const [alerts, setAlerts] = useState<ProactiveAlert[]>([]);
    const [entities, setEntities] = useState<Record<string, ExtractedEntity[]>>({});
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const analyzeDocument = useCallback(async (request: AnalysisRequest) => {
        setAnalyzing(true);
        setError(null);

        try {
            const result = await intelligenceService.analyzeDocument(request);
            setAnalysisResult(result);

            if (result.extraction?.entities) {
                setEntities(result.extraction.entities);
            }

            if (result.alerts) {
                setAlerts((prev) => [...prev, ...result.alerts]);
            }

            options.onAnalysisComplete?.(result);
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Analysis failed');
            setError(error);
            options.onError?.(error);
            return null;
        } finally {
            setAnalyzing(false);
        }
    }, [options]);

    const extractEntities = useCallback(async (text: string, entityTypes: string[]) => {
        setAnalyzing(true);
        setError(null);

        try {
            const result = await intelligenceService.extractEntities(text, entityTypes);
            setEntities(result);
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Extraction failed');
            setError(error);
            options.onError?.(error);
            return null;
        } finally {
            setAnalyzing(false);
        }
    }, [options]);

    const loadAlerts = useCallback(async (documentId?: string) => {
        try {
            const result = await intelligenceService.getAlerts(documentId);
            setAlerts(result);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to load alerts');
            setError(error);
            options.onError?.(error);
        }
    }, [options]);

    const respondToAlert = useCallback(async (
        alert: ProactiveAlert,
        response: 'accepted' | 'rejected' | 'modified',
        modifications?: Record<string, unknown>
    ) => {
        try {
            const updated = await intelligenceService.respondToAlert(alert.id, response, modifications);

            setAlerts((prev) =>
                prev.map((a) => (a.id === alert.id ? updated : a))
            );

            options.onAlertResponse?.(updated);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to respond to alert');
            setError(error);
            options.onError?.(error);
        }
    }, [options]);

    const acceptAlert = useCallback(async (alert: ProactiveAlert) => {
        await respondToAlert(alert, 'accepted');
    }, [respondToAlert]);

    const rejectAlert = useCallback(async (alert: ProactiveAlert) => {
        await respondToAlert(alert, 'rejected');
    }, [respondToAlert]);

    const modifyAlert = useCallback(async (
        alert: ProactiveAlert,
        modifications: Record<string, unknown>
    ) => {
        await respondToAlert(alert, 'modified', modifications);
    }, [respondToAlert]);

    const clearAlerts = useCallback(() => {
        setAlerts([]);
    }, []);

    const reset = useCallback(() => {
        setAnalyzing(false);
        setAlerts([]);
        setEntities({});
        setAnalysisResult(null);
        setError(null);
    }, []);

    return {
        analyzing,
        alerts,
        entities,
        analysisResult,
        error,
        analyzeDocument,
        extractEntities,
        loadAlerts,
        acceptAlert,
        rejectAlert,
        modifyAlert,
        clearAlerts,
        reset,
    };
}

export default useIntelligence;

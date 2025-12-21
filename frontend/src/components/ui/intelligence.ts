/**
 * Intelligence Components - Export all intelligence-related components
 */

// UI Components
export { AlertBanner } from './AlertBanner';
export { AlertPanel } from './AlertPanel';
export { EntityHighlighter } from './EntityHighlighter';
export { AnalysisProgress } from './AnalysisProgress';

// Types re-export for convenience
export type {
    ProactiveAlert,
    ExtractedEntity,
    SuggestedAction,
    AnalysisResult,
} from '@/services/intelligence';

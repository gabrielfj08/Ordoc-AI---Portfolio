// OrdocAir Services
export { default as DocumentService, TagService, ActivityLogService } from './documents';
export type { Document, Tag } from './documents';

export { default as DirectoryService } from './directories';

export { default as shareableLinksService } from './shareableLinks';

export { default as recentDocumentsService } from './recentDocuments';

export { default as recycleBinService } from './recycle-bin';

export {
  BatchOperationService,
  OCRService,
  SearchService,
} from './batch-operations';
export type {
  BatchOperation,
  BatchOperationItem,
  OCRResult,
  SearchResult,
} from './batch-operations';

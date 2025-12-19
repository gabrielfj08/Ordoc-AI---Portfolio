// Tipos de autenticação
export interface AuthCredentials {
  cpfCnpj: string;
  password: string;
}

export interface LoginAPIResponse {
  data: any;
  organizationId: number;
  id: number;
  token: string;
  name: string;
  email: string;
  cpfCnpj: string;
  status: externalRequesterStatus;
  prn: string;
  createdAt: string;
  updatedAt: string;
  code: number | null;
  parentGroupId: number | null;
  phone: string;
  optionalPhone?: string;
  birthDate: string;
  optionalEmail?: string;
  occupation: string;
  changedPassword: boolean;
  onTimePassword: string;
  notification: externalRequesterNotification;
}

export type externalRequesterStatus = 'active' | 'inactive';
export type externalRequesterNotification = 'sms' | 'email';

// Tipos de External Requester
export interface ShowExternalRequesterAPIResponse {
  id: number;
  organizationId: number;
  name: string;
  email: string;
  cpfCnpj: string;
  status: externalRequesterStatus;
  prn: string;
  createdAt: string;
  updatedAt: string;
  code: number | null;
  parentGroupId: number | null;
  phone: string;
  optionalPhone?: string;
  birthDate: string;
  optionalEmail?: string;
  occupation: string;
  changedPassword: boolean;
  onTimePassword: string;
  notification: externalRequesterNotification;
}

export interface MeExternalRequesterAPIResponse extends ShowExternalRequesterAPIResponse {}

export interface CreateExternalRequesterPayload {
  name: string;
  email: string;
  cpfCnpj: string;
  phone: string;
  password: string;
  optionalPhone?: string;
  birthDate: string;
  optionalEmail?: string;
  occupation: string;
  notification: externalRequesterNotification;
}

export interface CreateExternalRequesterAPIResponse extends ShowExternalRequesterAPIResponse {}

export interface UpdateExternalRequesterPayload {
  name?: string;
  email?: string;
  phone?: string;
  optionalPhone?: string;
  birthDate?: string;
  optionalEmail?: string;
  occupation?: string;
  notification?: externalRequesterNotification;
}

export interface UpdateExternalRequesterAPIResponse extends ShowExternalRequesterAPIResponse {}

export interface ResetPasswordPayload {
  cpfCnpj: string;
  password: string;
  onTimePassword: string;
  token: string;
}

export interface ResetPasswordAPIResponse {
  message: string;
}

export interface GenerateExternalOtpPayload {
  cpfCnpj: string;
  notification: GenerateOtpPayloadExternalNotification;
}

export interface GenerateExternalOtpAPIResponse {
  message: string;
}

export type GenerateOtpPayloadExternalNotification = 'sms' | 'email';

export interface UpdatePasswordPayload {
  currentPassword: string;
  password: string;
}

export interface UpdatePasswordAPIResponse {
  message: string;
}

// Tipos de Fields
export interface IndexExternalFieldsAPIResponse {
  data: IndexExternalField[];
}

export interface IndexExternalFieldParams {
  procedureTemplateId: number;
}

export interface IndexExternalField {
  id: number;
  name: string;
  fieldType: externalFieldTypeParams;
  required: boolean;
  fieldValueOptions: ExternalFieldValueOptions[];
  fieldDocumentTemplate: FieldExternalDocumentTemplate | null;
}

export type externalFieldTypeParams = 
  | 'text'
  | 'email'
  | 'number'
  | 'date'
  | 'select'
  | 'checkbox'
  | 'file'
  | 'textarea'
  | 'document_template';

export interface FieldExternalDocumentTemplate {
  id: number;
  name: string;
  s3Key: string;
}

export interface ExternalFieldValueOptions {
  id: number;
  name: string;
}

// Tipos de Procedures
export interface IndexExternalProceduresAPIResponse {
  data: IndexExternalProcedure[];
}

export interface IndexExternalProcedure {
  id: number;
  name: string;
  status: externalProcedureStatus;
  createdAt: string;
  updatedAt: string;
  schema: ExternalProcedureSchemaItems[];
  payload: ExternalProcedurePayloadItems[];
}

export interface ExternalProcedureSchemaItems {
  id: number;
  name: string;
  fieldType: externalProcedureFieldTypes;
  required: boolean;
  fieldValueOptions: ExternalFieldValueOptions[];
  fieldDocumentTemplate: FieldExternalDocumentTemplate | null;
}

export interface ExternalProcedurePayloadItems {
  fieldId: number;
  value: any;
  label: string;
  fieldType: externalProcedureFieldTypes;
}

export type externalProcedureFieldTypes = externalFieldTypeParams;

export type externalProcedureStatus = 
  | 'draft'
  | 'submitted'
  | 'in_analysis'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'started';

export interface IndexExternalProcedureParams {
  status?: externalProcedureStatus;
  page?: number;
  per_page?: number;
}

export interface CreateExternalProcedurePayload {
  procedureTemplateId: number;
  payload: ExternalProcedurePayloadItems[];
}

export interface CreateExternalProcedureAPIResponse {
  id: number;
  name: string;
  status: externalProcedureStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ShowExternalProcedureAPIResponse {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  requesterId: number;
  requester: {
    name: string;
    email: string;
  };
  parentProcedureTemplateName: string;
  procedureTemplateName: string;
  responsibleGroup: {
    id: number;
    name: string;
  };
  payload: ExternalProcedurePayloadItems[];
  schema: any;
}

export interface UpdateExternalProcedurePayload {
  payload: ExternalProcedurePayloadItems[];
}

export interface UpdateExternalProcedureAPIResponse extends ShowExternalProcedureAPIResponse {}

export interface RunExternalProcedureAPIResponse {
  message: string;
}

export interface RequestFinishProcedurePayload {
  justificationNote: string;
}

export interface RequestFinishProcedureAPIResponse {
  message: string;
}

// Tipos de Tasks
export interface IndexExternalTasksAPIResponse {
  data: IndexExternalTask[];
}

export interface IndexExternalTask {
  id: number;
  name: string;
  description: string;
  status: taskExternalStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignee: ExternalTaskAssignee;
  groupAssignee: ExternalTaskGroupAssignee;
  procedure: ExternalTaskProcedure;
  createdBy: ExternalTaskCreatedBy;
}

export interface ExternalTaskAssignee {
  id: number;
  name: string;
  email: string;
}

export interface ExternalGroupAssignee {
  id: number;
  name: string;
  groupRequesters: ExternalTaskGroupAssignee[];
}

export interface ExternalTaskGroupAssignee {
  id: number;
  name: string;
  email: string;
}

export interface ExternalTaskProcedure {
  id: number;
  name: string;
}

export interface ExternalTaskCreatedBy {
  id: number;
  name: string;
  email: string;
}

export type taskExternalStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface IndexExternalTasksParams {
  status?: taskExternalStatus;
  page?: number;
  per_page?: number;
}

export interface ShowExternalTaskAPIResponse extends IndexExternalTask {}

export interface AcceptExternalTaskAPIResponse {
  message: string;
}

export interface RefuseExternalTaskPayload {
  justificationNote: string;
}

export interface RefuseExternalTaskAPIResponse {
  message: string;
}

export interface FinishExternalTaskAPIResponse {
  message: string;
}

// Tipos de Signatures
export interface IndexExternalSignaturesAPIResponse {
  data: IndexExternalSignature[];
}

export interface IndexExternalSignature {
  id: number;
  documentName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  procedureId: number;
}

export interface IndexExternalSignatureParams {
  status?: string;
  page?: number;
  per_page?: number;
}

export interface ShowExternalSignatureAPIResponse extends IndexExternalSignature {}

export interface SignExternalSignatureAPIResponse {
  message: string;
}

export interface RefuseExternalSignaturePayload {
  justificationNote: string;
}

export interface RefuseExternalSignatureAPIResponse {
  message: string;
}

// Tipos de Shared Procedures
export interface IndexSharedProceduresAPIResponse {
  data: IndexSharedProcedure[];
}

export interface IndexSharedProcedure {
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  procedure: IndexSharedProcedureProcedure;
  externalRequester: IndexSharedProcedureExternalRequester;
}

export interface IndexSharedProcedureProcedure {
  id: number;
  name: string;
  status: externalProcedureStatus;
  schema: IndexSharedProcedureSchemaItem[];
  payload: IndexSharedProcedurePayloadItem[];
}

export interface IndexSharedProcedureExternalRequester {
  id: number;
  name: string;
  email: string;
}

export interface IndexSharedProcedureSchemaItem {
  id: number;
  name: string;
  fieldType: externalProcedureFieldTypes;
  required: boolean;
  fieldValueOptions: ExternalFieldValueOptions[];
  fieldDocumentTemplate: FieldExternalDocumentTemplate | null;
}

export interface IndexSharedProcedurePayloadItem {
  fieldId: number;
  value: any;
}

export interface IndexSharedProceduresParams {
  status?: string;
  page?: number;
  per_page?: number;
}

export interface CreateSharedProcedurePayload {
  procedureId: number;
  externalRequesterId: number;
}

export interface CreateSharedProcedureAPIResponse {
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcceptSharedProcedureAPIResponse {
  message: string;
}

export interface RefuseSharedProcedurePayload {
  justificationNote: string;
}

export interface RefuseSharedProcedureAPIResponse {
  message: string;
}

export interface DestroySharedProcedureAPIResponse {
  message: string;
}

// Tipos de Reports
export interface ShowExternalReportAPIResponse {
  proceduresRunningCount: number;
  proceduresStartedCount: number;
  tasksRunningCount: number;
  signaturesPendingCount: number;
  sharedProceduresPendingCount: number;
}

export interface CreateExternalReportAPIResponse extends ShowExternalReportAPIResponse {}

// Tipos de Procedure Templates
export interface IndexExternalProcedureTemplateAPIResponse {
  data: ExternalBaseProcedureTemplate[];
}

export interface ExternalBaseProcedureTemplate {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShowExternalProcedureTemplateAPIResponse extends ExternalBaseProcedureTemplate {
  fields: IndexExternalField[];
}

export interface ExternalProcedureTemplatePayload {
  name: string;
  description: string;
}

export type groupRequesterStatus = 'active' | 'inactive';

// Tipos de Justification Notes
export interface IndexExternalJustificationNotesAPIResponse {
  data: IndexExternalJustificationNote[];
}

export interface IndexExternalJustificationNote {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface IndexExternalJustificationNotesParams {
  procedureId?: number;
  taskId?: number;
  page?: number;
  per_page?: number;
}

// Tipos de Task Comments
export interface IndexExternalTaskCommentsAPIResponse {
  data: IndexExternalTaskComment[];
}

export interface IndexExternalTaskComment extends BaseExternalTaskComment {
  createdBy: CreatedByTaskExternalComment;
}

export interface BaseExternalTaskComment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatedByTaskExternalComment {
  id: number;
  name: string;
  email: string;
}

export interface TaskExternalCommentPayload {
  content: string;
}

export interface ShowExternalTaskCommentAPIResponse extends IndexExternalTaskComment {}

export interface CreateExternalTaskCommentPayload extends TaskExternalCommentPayload {}

export interface CreateExternalTaskCommentAPIResponse extends BaseExternalTaskComment {}

export interface UpdateExternalTaskCommentPayload extends TaskExternalCommentPayload {}

export interface UpdateExternalTaskCommentAPIResponse extends BaseExternalTaskComment {}

export interface DeleteExternalTaskCommentAPIResponse {
  message: string;
}

// Tipos de Task Documents
export interface IndexExternalTaskDocumentsAPIResponse {
  data: IndexExternalTaskDocument[];
}

export interface IndexExternalTaskDocument {
  id: number;
  name: string;
  s3Key: string;
  createdAt: string;
  updatedAt: string;
}

export interface IndexExternalTaskDocumentsParams {
  taskId: number;
  page?: number;
  per_page?: number;
}

export interface CreateExternalTaskDocumentPayload {
  name: string;
  file: File;
}

export interface CreateExternalTaskDocumentAPIResponse extends IndexExternalTaskDocument {}

export interface ShowExternalTaskDocumentAPIResponse extends IndexExternalTaskDocument {}

// Tipos de Procedure Documents
export interface IndexProcedureDocumentsAPIResponse {
  data: IndexExternalTaskDocument[];
}

export interface IndexProcedureDocumentsParams {
  procedureId: number;
  page?: number;
  per_page?: number;
}

export interface CreateProcedureDocumentPayload {
  name: string;
  file: File;
}

export interface CreateProcedureDocumentAPIResponse extends IndexExternalTaskDocument {}

export interface ShowProcedureDocumentAPIResponse extends IndexExternalTaskDocument {}

export interface DeleteProcedureDocumentAPIResponse {
  message: string;
}

// Tipos de Procedure Reports
export interface CreateExternalProcedureReportAPIResponse {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShowExternalProcedureReportAPIResponse extends CreateExternalProcedureReportAPIResponse {}

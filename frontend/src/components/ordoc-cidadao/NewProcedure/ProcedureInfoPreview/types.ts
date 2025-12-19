export interface ProcedurePreviewProps {
  subject?: {
    name: string;
    groupRequester?: {
      name: string;
    };
  };
  procedureTemplate?: {
    name: string;
  };
}

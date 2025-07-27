export interface ShowDecreeAPIResponse {
  id: number;
  decreeNumber: number;
  decreeDate: string;
  decreeUrl: string;
  lawNumber: number | null;
  lawDate: string | null;
  lawUrl: string | null;
  body: string | null;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShareableLink {
  id: string;
  token: string;
  document: number | null;
  document_name?: string;
  expires_at: string | null;
  is_expired: boolean;
  access_count: number;
  max_access_count: number | null;
  is_active: boolean;
  created_by: number | null;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateShareableLinkPayload {
  expires_at?: string | null;
  max_access_count?: number | null;
  password?: string;
}

export type CreateShareableLinkAPIResponse = ShareableLink;
export type IndexShareableLinkAPIResponse = ShareableLink[];
export type ShowShareableLinkAPIResponse = ShareableLink;

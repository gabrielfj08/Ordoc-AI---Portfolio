export interface ShowThemePIResponse {
  id: number;
  organizationId: number;
  imageUrl: string;
  backgroundUrl: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateThemePIResponse extends ShowThemePIResponse {}

export interface UpdateThemePIResponse extends ShowThemePIResponse {}

export interface DeleteThemeAPIResponse extends ShowThemePIResponse {}
export interface CreateThemePayload {
  imageUrl: string;
  backgroundUrl: string;
  color: string;
}

export interface UpdateThemePayload extends CreateThemePayload {}

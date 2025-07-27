export interface IndexAppsOptions {
  order?: string;
  direction?: string;
  organizationId?: number;
}

export interface IndexAppsAPIResponse extends Array<IndexApp> {}

export interface IndexApp {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  prn: string;
  logoUrl: string;
  service: string;
}

export interface BaseDirectory {
  id: number;
  name: string;
  description: string;
  organizationId: number;
  prn: string;
  parentDirectoryId: number | null;
  previousParentPrn: string | null;
  createdAt: string;
  updatedAt: string;
}

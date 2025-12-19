// Types for OrdocCloud Organizations Show component

import { Organization } from '../edit/types';

export interface ShowOrganizationContainerProps {
  organizationId: string; // UUID string instead of number
}

export interface ShowOrganizationProps {
  organization: Organization;
}

export interface StorageUsageData {
  ordocAir: number;
  ordocFlow: number;
  ordocSign: number;
  ordocReports: number;
  total: number;
  available: number;
}

export interface WidgetData {
  title: string;
  value: number;
  unit: string;
  color: string;
  percentage: number;
}

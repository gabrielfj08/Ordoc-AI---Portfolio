import {
  OrganizationAPIResponse,
  MeAPIResponse,
  ShowUserAPIResponse,
} from '../../services/types';
import { ShowDirectoryAPIResponse } from '../../services/printer-air/types';
import { cidColors } from 'printer-ui';

export interface SessionData {
  organization: OrganizationAPIResponse;
  directory: ShowDirectoryAPIResponse;
  user: MeAPIResponse;
  externalUserId: number;
}

export interface SessionContextData {
  session: SessionData;
  setSession: (sessionData: SessionData) => void;
  unauthorized: boolean;
  themeColor: cidColors | string;
}

export interface SessionProviderProps {
  children: React.ReactNode;
}

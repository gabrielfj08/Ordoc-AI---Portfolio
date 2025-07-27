import { ShowExternalReportAPIResponse } from '../../services/flow-cidadao/types';

export interface HomeProps {
  reportId: number;
}

export interface CardsContainerProps {
  reportId: number;
}

export interface CardsProps {
  reportData: ShowExternalReportAPIResponse;
  handleClick: () => void;
}

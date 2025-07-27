import { cidColors } from 'printer-ui';
import { MeExternalRequesterAPIResponse } from '../../services/flow-cidadao/types';

export interface TransitionProps {
  animated: boolean;
  externalRequester?: MeExternalRequesterAPIResponse;
  color: string;
}

export const animatedGradientColorMapping: Record<cidColors, string> = {
  cidBlue: 'via-cidBlue/30',
  cidCyan: 'via-cidCyan/30',
  cidGold: 'via-cidGold/30',
  cidGray: 'via-cidGray/30',
  cidGreen: 'via-cidGreen/30',
  cidMagenta: 'via-cidMagenta/30',
  cidOrange: 'via-cidOrange/30',
  cidPurple: 'via-cidPurple/30',
};

export const gradientColorMapping: Record<cidColors, string> = {
  cidBlue: 'via-cidBlue/10',
  cidCyan: 'via-cidCyan/10',
  cidGold: 'via-cidGold/10',
  cidGray: 'via-cidGray/10',
  cidGreen: 'via-cidGreen/10',
  cidMagenta: 'via-cidMagenta/10',
  cidOrange: 'via-cidOrange/10',
  cidPurple: 'via-cidPurple/10',
};

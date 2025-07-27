import * as React from 'react';
import { Icon, TypographyV3 as Typography, icon } from 'printer-ui';
import { ReportMessageProps } from './types';

const formatDate = (date) => {
  return (
    new Date(Date.parse(date)).toLocaleDateString('pt-br') +
    ' às ' +
    new Date(Date.parse(date)).toLocaleTimeString('pt-br')
  );
};

const setIcon: Record<string, icon> = {
  create: 'procedureCreated',
  archive: 'procedureArchived',
  unarchive: 'procedureUnarchived',
  finish: 'procedureFinishedV3',
};

const ReportMessage = ({
  action,
  createdBy,
  createdAt,
  note,
  color,
}: ReportMessageProps) => {
  switch (action) {
    case 'create':
      return (
        <div className="flex items-center space-x-2">
          <Icon
            alt=""
            name={setIcon[action]}
            stroke
            h={22}
            w={22}
            color={color}
          />
          <Typography variant="bodySm" family="jakartaLight">
            Processo <span className="font-jakarta-500">criado</span> por{' '}
            {createdBy}, no dia {formatDate(createdAt)}
          </Typography>
        </div>
      );
    case 'archive':
      return (
        <div className="flex items-center space-x-2">
          <Icon
            alt=""
            name={setIcon[action]}
            stroke
            h={22}
            w={22}
            color={color}
          />
          <Typography variant="bodySm" family="jakartaLight">
            Processo <span className="font-jakarta-500">arquivado </span> por{' '}
            {createdBy}, no dia {formatDate(createdAt)}.{' '}
            <span className="font-jakarta-500">Justificativa: </span> {note}
          </Typography>
        </div>
      );
    case 'unarchive':
      return (
        <div className="flex items-center space-x-2">
          <Icon
            alt=""
            name={setIcon[action]}
            stroke
            h={22}
            w={22}
            color={color}
          />
          <Typography variant="bodySm" family="jakartaLight">
            Processo <span className="font-jakarta-500">desarquivado </span> por{' '}
            {createdBy}, no dia {formatDate(createdAt)}.{' '}
            <span className="font-jakarta-500">Justificativa: </span> {note}.
          </Typography>
        </div>
      );
    case 'finish':
      return (
        <div className="flex items-center space-x-2">
          <Icon
            alt=""
            name={setIcon[action]}
            stroke
            h={22}
            w={22}
            color={color}
          />
          <Typography variant="bodySm" family="jakartaLight">
            Processo <span className="font-jakarta-500">finalizado</span> por{' '}
            {createdBy}, no dia {formatDate(createdAt)}.
          </Typography>
        </div>
      );
    default:
      return null;
  }
};

export default ReportMessage;

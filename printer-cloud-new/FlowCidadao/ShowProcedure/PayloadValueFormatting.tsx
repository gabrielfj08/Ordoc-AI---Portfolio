import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';
import { FieldTypes } from '../constants/FieldTypes';
import { cnpjMask, cpfMask, phoneNumberMask } from '../../utils';
import AttachmentList from './AttachmentList';

const PayloadValueFormatting = ({ fieldType, procedureId, value }) => {
  switch (fieldType) {
    case FieldTypes.attachment:
      return <AttachmentList procedureId={procedureId} value={value} />;
    case FieldTypes.cnpj:
      return (
        <>
          <div className="hidden sm:block">
            <Typography
              variant="bodyLg"
              family="jakarta"
              color="darkGray"
              align="start"
            >
              {cnpjMask(value)}
            </Typography>
          </div>
          <div className="sm:hidden">
            <Typography
              variant="bodyMd"
              family="jakarta"
              color="darkGray"
              align="start"
            >
              {cnpjMask(value)}
            </Typography>
          </div>
        </>
      );
    case FieldTypes.cpf:
      return (
        <>
          <div className="hidden sm:block">
            <Typography
              variant="bodyLg"
              family="jakarta"
              color="darkGray"
              align="start"
            >
              {cpfMask(value)}
            </Typography>
          </div>
          <div className="sm:hidden">
            <Typography
              variant="bodyMd"
              family="jakarta"
              color="darkGray"
              align="start"
            >
              {cpfMask(value)}
            </Typography>
          </div>
        </>
      );
    case FieldTypes.phone:
      return (
        <>
          <div className="hidden sm:block">
            <Typography
              variant="bodyLg"
              family="jakarta"
              color="darkGray"
              align="start"
            >
              {phoneNumberMask(value)}
            </Typography>
          </div>
          <div className="sm:hidden">
            <Typography
              variant="bodyMd"
              family="jakarta"
              color="darkGray"
              align="start"
            >
              {phoneNumberMask(value)}
            </Typography>
          </div>
        </>
      );
    case FieldTypes.date:
      return (
        <>
          <div className="hidden sm:block">
            <Typography
              variant="bodyLg"
              family="jakarta"
              color="darkGray"
              align="start"
            >
              {new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'short',
              }).format(
                new Date(new Date(value).toISOString().replace('.000Z', ''))
              )}
            </Typography>
          </div>
          <div className="sm:hidden">
            <Typography
              variant="bodyMd"
              family="jakarta"
              color="darkGray"
              align="start"
            >
              {new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'short',
              }).format(
                new Date(new Date(value).toISOString().replace('.000Z', ''))
              )}
            </Typography>
          </div>
        </>
      );
    case FieldTypes.checkbox:
      return value.map((value) => (
        <>
          <div className="hidden sm:block">
            <Typography
              variant="bodyLg"
              family="jakarta"
              color="darkGray"
              align="start"
            >
              {value}
            </Typography>
          </div>
          <div className="sm:hidden">
            <Typography
              variant="bodyMd"
              family="jakarta"
              color="darkGray"
              align="start"
            >
              {value}
            </Typography>
          </div>
        </>
      ));
    default:
      return (
        <>
          <div className="hidden sm:block">
            <Typography
              variant="bodyLg"
              family="jakarta"
              color="darkGray"
              align="start"
            >
              {value}
            </Typography>
          </div>
          <div className="sm:hidden">
            <Typography
              variant="bodyMd"
              family="jakarta"
              color="darkGray"
              align="start"
            >
              {value}
            </Typography>
          </div>
        </>
      );
  }
};

export default PayloadValueFormatting;

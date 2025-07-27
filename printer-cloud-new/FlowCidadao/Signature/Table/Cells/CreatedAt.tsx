import * as React from 'react';
import { TypographyV3 as Typography, Icon } from 'printer-ui';
import { CellProps } from '../types';

const CreatedAtCell = ({ signature, color }: CellProps) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Icon alt="calendar" name="calendar" stroke h={25} w={25} color={color} />
      <Typography variant="bodyMd" family="jakartaLight">
        {new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
        }).format(
          new Date(
            new Date(signature.createdAt).toISOString().replace('.000Z', '')
          )
        )}
      </Typography>
    </div>
  );
};

export default CreatedAtCell;

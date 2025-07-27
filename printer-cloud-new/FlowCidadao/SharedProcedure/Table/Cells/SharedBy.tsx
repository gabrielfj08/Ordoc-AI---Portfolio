import * as React from 'react';
import { TypographyV3 as Typography, Icon } from 'printer-ui';
import { CellProps } from '../types';

const SharedByCell = ({ sharedProcedure, color }: CellProps) => {
  return (
    <div className="hidden sm:flex items-center justify-center space-x-2">
      <Icon alt="usuario" name="user" stroke h={25} w={25} color={color} />
      <Typography variant="bodyMd" family="jakartaLight">
        {sharedProcedure.createdBy.name}
      </Typography>
    </div>
  );
};

export default SharedByCell;

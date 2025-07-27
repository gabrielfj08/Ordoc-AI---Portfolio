import { Icon, Typography } from 'printer-ui';
import * as React from 'react';
import { ProcedureInfoCasesProps } from '../types';

const Priority = ({ procedure }: ProcedureInfoCasesProps) => {
  switch (procedure.priority) {
    case 'high':
      return (
        <>
          <Icon
            alt="highPriority"
            name="highPriority"
            stroke
            fill
            w={25}
            h={25}
            color="error"
            className="mr-2"
          />
          <Typography variant="footnote1">Alta</Typography>
        </>
      );

    case 'normal':
      return (
        <>
          <Icon
            alt="highPriority"
            name="mediumPriority"
            stroke
            fill
            w={25}
            h={25}
            color="yellow"
            className="mr-2"
          />
          <Typography variant="footnote1">Normal</Typography>
        </>
      );

    default:
      return null;
  }
};

export default Priority;

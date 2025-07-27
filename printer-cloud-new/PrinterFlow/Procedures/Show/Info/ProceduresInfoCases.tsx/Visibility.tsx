import { Icon, Typography } from 'printer-ui';
import * as React from 'react';
import { ProcedureInfoCasesProps } from '../types';

const Visibility = ({ procedure }: ProcedureInfoCasesProps) => {
  switch (procedure.private) {
    case true:
      return (
        <>
          <Icon
            alt="locked"
            name="locked"
            stroke
            w={25}
            h={25}
            color="error"
            className="mr-2"
          />
          <Typography variant="footnote1">Privado</Typography>
        </>
      );

    case false:
      return (
        <>
          <Icon
            alt="unlocked"
            name="unlocked"
            stroke
            w={25}
            h={25}
            color="success"
            className="mr-2"
          />
          <Typography variant="footnote1">Público</Typography>
        </>
      );

    default:
      return null;
  }
};

export default Visibility;

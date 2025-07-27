import * as React from 'react';
import { Tag } from 'printer-ui';
import { SharedStatusTagProps } from './types';
import { SharedProceduresStatus } from '../../../../constants/SharedProcedures';

const SharedStatusTag = ({ status, color }: SharedStatusTagProps) => {
  switch (status) {
    case SharedProceduresStatus.accepted:
      return (
        <Tag
          label="Acompanhando"
          bgColor={color}
          color="white"
          className="uppercase"
          w="fit"
        />
      );

    case SharedProceduresStatus.created:
      return (
        <Tag
          label="Aguardando"
          bgColor="cidOrangeLight"
          color="cidOrange"
          className="uppercase"
          w="fit"
        />
      );

    case SharedProceduresStatus.refused:
      return (
        <Tag
          label="Não acompanha"
          bgColor="error"
          color="white"
          className="uppercase truncate"
          w="fit"
        />
      );

    default:
      return null;
  }
};

export default SharedStatusTag;

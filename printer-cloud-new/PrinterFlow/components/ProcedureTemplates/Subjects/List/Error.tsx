import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const SubjectsListFieldError = () => {
  return (
    <div className="h-20 flex items-center justify-center border-2 border-lightGray bg-white">
      <Icon
        name="info"
        alt="info"
        color="red"
        stroke
        w={26}
        h={26}
        className="mr-2"
      />
      <Typography variant="footnote2" color="gray">
        Erro ao listar os assuntos deste tipo de processo.
      </Typography>
    </div>
  );
};

export default SubjectsListFieldError;

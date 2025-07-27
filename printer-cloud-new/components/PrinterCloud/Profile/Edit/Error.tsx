import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const EditProfileError = () => {
  return (
    <div className="h-80 items-center justify-center flex w-[38.5rem] space-x-2">
      <Icon name="info" alt="info" color="red" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray">
        Erro ao carregar os dados do perfil. Tente novamente mais tarde.
      </Typography>
    </div>
  );
};

export default EditProfileError;

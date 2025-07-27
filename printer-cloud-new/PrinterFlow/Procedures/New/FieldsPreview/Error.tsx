import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const FieldsPreviewError = () => {
  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center space-x-2">
        <Icon alt="info" name="info" stroke w={28} h={28} />
        <Typography variant="footnote1" family="robotoMedium">
          Ao clicar em “Continuar”, o formulário a ser preenchido será:
        </Typography>
      </div>
      <Typography family="robotoMedium" color="gray">
        Campos do Processo
      </Typography>
      <div className="border border-lighterGray flex items-center space-x-2 justify-center py-7 px-4">
        <Icon alt="alert" name="alert" color="error" stroke />
        <Typography variant="footnote1" color="gray" align="center">
          Erro! Não foi possível carregar o preview dos campos, tente novamente
          mais tarde.
        </Typography>
      </div>
    </div>
  );
};

export default FieldsPreviewError;

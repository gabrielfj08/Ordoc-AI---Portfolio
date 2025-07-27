import { Icon, Typography } from 'printer-ui';
import * as React from 'react';

const FieldsPreviewEmpty = () => {
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
        <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
        <Typography variant="footnote1" color="gray" align="center">
          Este tipo de processo ou assunto não possui campos.
        </Typography>
      </div>
    </div>
  );
};

export default FieldsPreviewEmpty;

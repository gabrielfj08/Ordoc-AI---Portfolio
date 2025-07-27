import * as React from 'react';
import router from 'next/router';
import { Button, Icon, Typography } from 'printer-ui';
import { FieldsEmptyProps } from './types';

const FieldsEmpty = ({ procedure }: FieldsEmptyProps) => {
  return (
    <div className="w-screen sm:w-full px-4 space-y-8 sm:pr-10">
      <Typography family="robotoMedium" color="gray">
        Campos do Processo
      </Typography>
      <div className="border border-lighterGray flex items-center space-x-2 justify-center py-7 px-4">
        <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
        <Typography variant="footnote1" color="gray" align="center">
          Este tipo de processo ou assunto não possui campos.
        </Typography>
      </div>
      <div className="mt-8 w-full flex justify-end">
        <span className="hidden sm:block">
          <Button
            label="Salvar processo"
            type="submit"
            color="info"
            onClick={() =>
              router.push(
                `/printer-flow/group-requesters/${procedure.responsibleGroupId}/procedures/${procedure.id}`
              )
            }
          />
        </span>
        <span className="sm:hidden">
          <Button label="Salvar" type="submit" color="info" />
        </span>
      </div>
    </div>
  );
};

export default FieldsEmpty;

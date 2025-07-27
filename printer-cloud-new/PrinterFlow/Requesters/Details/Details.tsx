import * as React from 'react';
import { useDrawer } from '../../../hooks';
import { Icon, Typography } from 'printer-ui';
import { DetailsRequesterProps } from './types';
import InactiveRequesterDetails from './Inactive';
import ProceduresCount from './ProceduresCount';

const DetailsRequester = ({ requester }: DetailsRequesterProps) => {
  const { closeDrawer } = useDrawer();
  const boxClassName =
    'w-full h-fit bg-lighterGray py-5 px-3.5 rounded-lg border border-lightGray flex space-x-2.5 items-center shadow-default';

  return (
    <div className="w-screen max-w-full h-screen px-4 sm:px-14 flex flex-col py-8 space-y-4 overflow-auto">
      <div className="flex justify-end">
        <button
          onClick={() => {
            closeDrawer();
          }}
        >
          <Icon name="close" alt="close" stroke w={35} h={35} />
        </button>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4">
        <Icon alt="info" name="info" stroke w={26} h={26} />
        <Typography family="robotoMedium" variant="headline">
          Detalhes do solicitante
        </Typography>
      </div>

      <div className={`${boxClassName}`}>
        <Icon name="requesterV3" alt="requester" fill w={20} h={20} />
        <div className="space-y-2">
          <Typography variant="footnote1" family="robotoMedium">
            Nome do solicitante:
          </Typography>
          <Typography variant="footnote1">{requester.name}</Typography>
        </div>
      </div>
      <ProceduresCount requesterId={requester.id} />

      {requester.status === 'inactive' && (
        <InactiveRequesterDetails justifiableId={requester.id} />
      )}
    </div>
  );
};

export default DetailsRequester;

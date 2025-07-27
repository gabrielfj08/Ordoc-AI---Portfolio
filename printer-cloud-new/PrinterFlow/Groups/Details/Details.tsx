import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { useDrawer } from '../../../hooks';
import { DetailsGroupProps } from './types';
import ProceduresCount from './ProceduresCount';
import InactiveGroupDetails from './Inactive';

const DetailsGroup = ({ groupRequester }: DetailsGroupProps) => {
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
          Detalhes do grupo
        </Typography>
      </div>
      <div className={boxClassName}>
        <Icon name="groupRequesterV3" alt="requesterGroup" fill w={20} h={20} />
        <div className="space-y-2">
          <Typography variant="footnote1" family="robotoMedium">
            Código do grupo:
          </Typography>
          <Typography variant="footnote1">{groupRequester.code}</Typography>
        </div>
      </div>

      <div className={boxClassName}>
        <Icon name="groupRequesterV3" alt="requesterGroup" fill w={20} h={20} />
        <div className="space-y-2">
          <Typography variant="footnote1" family="robotoMedium">
            Nome do grupo:
          </Typography>
          <Typography variant="footnote1">{groupRequester.name}</Typography>
        </div>
      </div>
      <ProceduresCount responsibleGroupId={groupRequester.id} />

      {groupRequester.status === 'inactive' && (
        <InactiveGroupDetails justifiableId={groupRequester.id} />
      )}
    </div>
  );
};

export default DetailsGroup;

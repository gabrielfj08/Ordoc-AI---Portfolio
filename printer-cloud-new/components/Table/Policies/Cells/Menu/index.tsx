import * as React from 'react';
import { useModal } from '../../../../../hooks';
import { PolicyMenuCellContainerProps } from './types';
import { menuOptions } from '../../../../../components/MenuButton/types';
import MenuButton from '../../../../MenuButton/MenuButton';
import Delete from '../../../../Modal/Policy/Delete/Delete';

const PolicyMenuCellContainer = ({ policy }: PolicyMenuCellContainerProps) => {
  const { openModal } = useModal();

  const options: Array<menuOptions> = [
    {
      label: 'Excluir',
      icon: 'trash',
      fill: false,
      stroke: true,
      onClick: () => {
        openModal(<Delete policy_id={policy.id} policy_name={policy.name} />);
      },
    },
  ];

  return <MenuButton options={options} />;
};

export default PolicyMenuCellContainer;

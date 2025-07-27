import * as React from 'react';
import { ProcedureTemplateMenuButtonListProps } from './types';
import MenuButton from '../../../../../../components/MenuButton/MenuButton';

const ProcedureTemplateMenuButtonList = ({
  options,
}: ProcedureTemplateMenuButtonListProps) => {
  return (
    <div className="flex justify-center items-center sm:space-x-8">
      <MenuButton options={options} />
    </div>
  );
};

export default ProcedureTemplateMenuButtonList;

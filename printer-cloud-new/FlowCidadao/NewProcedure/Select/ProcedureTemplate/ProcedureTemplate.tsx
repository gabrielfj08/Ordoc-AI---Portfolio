import * as React from 'react';
import { SelectV3 as Select } from 'printer-ui';
import { useSession } from '../../../../hooks';
import { ProcedureTemplateSelectProps } from './types';
import { multipleSelectItem } from '../../../../types';

const ProcedureTemplateSelect = ({
  items,
  formik,
}: ProcedureTemplateSelectProps) => {
  const { themeColor } = useSession();

  const [selectedItems, setSelectedItems] = React.useState<
    multipleSelectItem[]
  >([]);

  return (
    <Select
      size="md"
      w="full"
      name="procedureTemplateId"
      label="Tipo de processo*"
      placeholder="Nome do tipo de processo"
      noOptionsMessage={() => 'Nenhum tipo de processo encontrado'}
      color={themeColor}
      icon="searchV3"
      options={items}
      value={selectedItems}
      onChange={(selectedOption) => {
        formik.setFieldValue('procedureTemplateId', selectedOption.value);
        setSelectedItems(selectedOption);
      }}
    />
  );
};

export default ProcedureTemplateSelect;

import * as React from 'react';
import { SelectV3 as Select } from 'printer-ui';
import { SubjectSelectProps } from './types';
import { useSession } from '../../../../hooks';
import { multipleSelectItem } from '../../../../types';

const SubjectSelect = ({ items, formik }: SubjectSelectProps) => {
  const { session, themeColor } = useSession();

  const [selectedItems, setSelectedItems] = React.useState<
    multipleSelectItem[]
  >([]);

  if (!session) return null;

  return (
    <div>
      <Select
        size="md"
        w="full"
        name="subjectTemplateId"
        label="Assunto do processo*"
        placeholder="Nome do assunto"
        noOptionsMessage={() =>
          'Nenhum assunto encontrado - Selecione outro tipo de processo'
        }
        color={themeColor}
        icon="searchV3"
        options={items}
        value={selectedItems}
        onChange={(selectedOption) => {
          formik.setFieldValue('subjectTemplateId', selectedOption.value);
          setSelectedItems(selectedOption);
        }}
      />
    </div>
  );
};

export default SubjectSelect;

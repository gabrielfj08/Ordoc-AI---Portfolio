import * as React from 'react';
import { SelectV3 as Select } from 'printer-ui';
import { useSession } from '../../../../hooks';

const SubjectEmpty = () => {
  const { themeColor } = useSession();

  return (
    <Select
      isDisabled
      size="md"
      w="full"
      name="subjectTemplateId"
      label="Assunto do processo*"
      placeholder="Nome do assunto"
      icon="searchV3"
      color={themeColor}
      options={[]}
      onChange={undefined}
      value={undefined}
    />
  );
};

export default SubjectEmpty;

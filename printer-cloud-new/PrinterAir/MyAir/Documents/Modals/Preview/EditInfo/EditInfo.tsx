import * as React from 'react';
import { Button } from 'printer-ui';
import { EditDocumentInfoProps } from './types';
import EditDocumentInfoForm from './EditInfoForm';

const EditDocumentInfo = ({ document }: EditDocumentInfoProps) => {
  const [isFormVisible, setFormVisibility] = React.useState<boolean>(false);

  const toggleFormVisibility = () => {
    setFormVisibility((current) => !current);
  };

  return isFormVisible ? (
    <div className="mb-5">
      <EditDocumentInfoForm
        onClose={toggleFormVisibility}
        document={document}
      />
    </div>
  ) : (
    <div className="flex justify-center lg:justify-end mb-5 ">
      <Button
        label="Editar informações"
        size="md"
        color="blue"
        onClick={toggleFormVisibility}
      >
        <Button.Icon
          name="edit"
          alt="Edit Icon"
          color="white"
          w={35}
          h={35}
          stroke
        />
      </Button>
    </div>
  );
};

export default EditDocumentInfo;

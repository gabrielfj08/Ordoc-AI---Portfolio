import * as React from 'react';
import { useFormik } from 'formik';
import { Input, Button } from 'printer-ui';
import { useSnackbar } from '../../../hooks';
import { EditGroupProps, EditGroupFormValues } from './types';

const EditGroup = ({ onSubmit, name }: EditGroupProps) => {
  const { showSnackbar } = useSnackbar();

  const initialValues = {
    name: name,
  };

  const formik = useFormik<EditGroupFormValues>({
    initialValues,
    onSubmit: (values) => {
      onSubmit(values)
        .then(() => {
          showSnackbar(`Alteração salva com sucesso.`, 'success');
        })
        .catch((error) => {
          if (error.response.status >= 400 && error.response.status < 500) {
            showSnackbar(error.response.data.message, 'error');
          } else {
            showSnackbar(
              'A alteração não pode ser salva, tente novamente mais tarde.',
              'error'
            );
          }
        });
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="md:flex flex-none lg:justify-between space-y-4 md:space-y-0"
    >
      <Input
        w="full"
        type="text"
        name="name"
        onChange={formik.handleChange}
        value={formik.values.name}
        className="lg:w-[650px]"
      />
      <div className="flex flex-col">
        <Button label="Salvar" size="md" color="success" className="">
          <Button.Icon
            alt="write"
            name="write"
            color="white"
            fill
            stroke
            h={23}
            w={23}
          />
        </Button>
      </div>
    </form>
  );
};

export default EditGroup;

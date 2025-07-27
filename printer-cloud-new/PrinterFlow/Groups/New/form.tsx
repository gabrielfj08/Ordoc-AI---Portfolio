import * as React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Typography, Input, Button } from 'printer-ui';
import { queryClient } from '../../../queryClient';
import { noEmojiValidator } from '../../../utils';
import { useAuth, useSnackbar } from '../../../hooks';
import { GroupRequesterService } from '../../../services/printer-flow';
import { NewGroupRequesterFormProps } from './types';

const NewGroupRequesterForm = ({
  id,
  onCancel,
}: NewGroupRequesterFormProps) => {
  const { token, subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();

  return (
    <Formik
      initialValues={{ name: '', id: id }}
      onSubmit={(values) =>
        GroupRequesterService.create(token, subdomain, {
          groupRequester: {
            name: values.name,
            parentGroupId: values.id,
          },
        })
          .then(() => {
            showSnackbar('Grupo criado com sucesso', 'success');
            queryClient.invalidateQueries([
              'newGroupRequester',
              token,
              subdomain,
            ]);
            onCancel();
          })
          .catch((err) => {
            if (err.response.status >= 400 && err.response.status < 500) {
              showSnackbar(err.response.data.message, 'error');
            } else {
              showSnackbar(
                'Oops, não foi possível criar o grupo. Tente novamente mais tarde.',
                'error'
              );
            }
          })
      }
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required('Campo obrigatório')
          .test(
            'regex',
            'Não utilize emojis (desenhos ou pictogramas).',
            noEmojiValidator
          ),
      })}
    >
      {(formik) => (
        <Form className="w-full">
          <div className="py-4 px-6 border border-lightGray rounded-lg mb-4 space-y-2 sm:space-y-0  w-full shadow-default">
            <div className="flex items-center">
              <Typography variant="footnote1" className="sm:w-56">
                Digite o nome do grupo:
              </Typography>
              <div className="w-full">
                <Input
                  w="full"
                  size="md"
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
                {formik.touched.name && formik.errors.name ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.name}
                  </Typography>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full mb-4">
            <Button
              label="Cancelar"
              color="error"
              onClick={onCancel}
              type="button"
            />
            <Button label="Criar grupo" color="info" type="submit" />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewGroupRequesterForm;

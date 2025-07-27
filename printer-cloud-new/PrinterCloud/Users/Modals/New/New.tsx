import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ActionBox, Button, Input, Typography } from 'printer-ui';
import { generateUsername, noEmojiValidator } from '../../../../utils';
import { useModal, useSnackbar } from '../../../../hooks';
import { NewUserModalProps, NewUserFormValues } from './types';
import ShowUserModal from '../Show';

const NewUserModal = ({ onSubmit }: NewUserModalProps) => {
  const { openModal, closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const initialValues: NewUserFormValues = {
    cpf: '',
    dateOfBirth: '',
    email: '',
    name: '',
    phone: '',
    registrationNumber: '',
    username: '',
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      onSubmit(values)
        .then((res: any) => {
          showSnackbar('Usuário criado com sucesso', 'success');
          openModal(<ShowUserModal userId={res.data.id} />);
        })
        .catch((error) => {
          showSnackbar(error.response.data.message, 'error');
        });
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required('Campo obrigatório')
        .test(
          'regex',
          'Não utilize emojis (desenhos ou pictogramas).',
          noEmojiValidator
        ),
      email: Yup.string().required('Campo obrigatório'),
      username: Yup.string()
        .required('Campo obrigatório')
        .test(
          'regex',
          'Não utilize emojis (desenhos ou pictogramas).',
          noEmojiValidator
        ),
    }),
  });

  React.useEffect(() => {
    formik.setFieldValue('username', generateUsername(formik.values.name));
  }, [formik.values.name]);

  return (
    <ActionBox>
      <form onSubmit={formik.handleSubmit}>
        <ActionBox.Header
          title="Criar usuário"
          color="blue"
          icon="user"
          fill
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-2">
            <div className="overflow-hidden sm:w-auto w-72">
              <div>
                <div className="mb-2">
                  <Typography variant="headline" family="robotoMedium">
                    Nome <span className="text-red">*</span>
                  </Typography>
                  <Input
                    w="full"
                    type="text"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <Typography variant="footnote2" color="error">
                      * {formik.errors.name}
                    </Typography>
                  )}
                </div>
                <div className="mb-2">
                  <Typography variant="headline" family="robotoMedium">
                    Email <span className="text-red">*</span>
                  </Typography>
                  <Input
                    w="full"
                    type="email"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <Typography variant="footnote2" color="error">
                      * {formik.errors.email}
                    </Typography>
                  )}
                </div>
                <div className="mb-2">
                  <Typography variant="headline" family="robotoMedium">
                    CPF
                  </Typography>
                  <Input
                    w="full"
                    type="cpf"
                    name="cpf"
                    onChange={formik.handleChange}
                    value={formik.values.cpf}
                  />
                </div>
                <div className="mb-2">
                  <Typography variant="headline" family="robotoMedium">
                    Data de nascimento
                  </Typography>
                  <Input
                    w="full"
                    type="date"
                    name="dateOfBirth"
                    onChange={formik.handleChange}
                    value={formik.values.dateOfBirth}
                  />
                </div>
                <div className="mb-2">
                  <Typography variant="headline" family="robotoMedium">
                    Telefone
                  </Typography>
                  <Input
                    w="full"
                    type="phone"
                    name="phone"
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                  />
                </div>
                <div className="mb-2">
                  <Typography variant="headline" family="robotoMedium">
                    Nº de Matrícula
                  </Typography>
                  <Input
                    w="full"
                    type="text"
                    name="registrationNumber"
                    onChange={formik.handleChange}
                    value={formik.values.registrationNumber}
                  />
                </div>
                <div className="mb-2">
                  <Typography variant="headline" family="robotoMedium">
                    Username <span className="text-red">*</span>
                  </Typography>
                  <Input
                    w="full"
                    type="text"
                    name="username"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                  />
                  {formik.touched.username && formik.errors.username && (
                    <Typography variant="footnote2" color="error">
                      * {formik.errors.username}
                    </Typography>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ActionBox.Content>
        <ActionBox.Footer>
          <Button
            type="button"
            color="error"
            onClick={closeModal}
            label="Cancelar"
          />
          <Button
            type="submit"
            color="blue"
            label="Criar usuário"
            disabled={false}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default NewUserModal;

import * as React from 'react';
import * as Yup from 'yup';
import router from 'next/router';
import { Form, Formik } from 'formik';
import { Button, Input, Typography } from 'printer-ui';
import { useModal, useSnackbar } from '../../../../hooks';
import { EditProfileProps, EditProfileFormValues } from './types';
import { noEmojiValidator } from '../../../../utils';
import AvatarButton from '../AvatarButton/AvatarButton';
import AvatarModal from '../Modal/Avatar';

const EditProfile = ({ user, onSubmit }: EditProfileProps) => {
  const { openModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const initialValues = {
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    dateOfBirth: user.dateOfBirth,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    registrationNumber: user.registrationNumber,
  } as EditProfileFormValues;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        onSubmit(values)
          .then(() => {
            showSnackbar(`Dados de perfil atualizados com sucesso.`, `success`);
          })
          .catch((error) => {
            showSnackbar(error.response.data.message, 'error');
          })
          .finally(() => {
            actions.setSubmitting(false);
          });
      }}
      enableReinitialize
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required('Campo obrigatório')
          .test(
            'regex',
            'Não utilize emojis (desenhos ou pictogramas).',
            noEmojiValidator
          ),
        email: Yup.string().required('Campo obrigatório'),
        registrationNumber: Yup.string().test(
          'regex',
          'Não utilize emojis (desenhos ou pictogramas).',
          noEmojiValidator
        ),
      })}
    >
      {(formik) => (
        <Form>
          <div className="px-5">
            <div className="">
              <div className="">
                <AvatarButton
                  user={formik.values}
                  onClick={() =>
                    openModal(
                      <AvatarModal
                        onSubmit={(s3Url: string) => {
                          formik.setFieldValue('avatarUrl', s3Url);
                        }}
                        user={user}
                        onClick={() => {}}
                      />
                    )
                  }
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Typography variant="footnote1" family="robotoMedium">
                    Nome
                  </Typography>
                  <Input
                    name="name"
                    type="text"
                    w="full"
                    size="lg"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <Typography variant="footnote2" color="error">
                      * {formik.errors.name}
                    </Typography>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Typography variant="footnote1" family="robotoMedium">
                    CPF
                  </Typography>
                  {user.cpf === '' ? (
                    <Input
                      name="cpf"
                      type="cpf"
                      w="full"
                      size="lg"
                      onChange={formik.handleChange}
                      value={formik.values.cpf}
                    />
                  ) : (
                    <Input
                      name="cpf"
                      type="cpf"
                      w="full"
                      size="lg"
                      onChange={() => {}}
                      value={user.cpf}
                      disabled
                    />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Typography variant="footnote1" family="robotoMedium">
                    Data de Nascimento
                  </Typography>
                  <Input
                    name="dateOfBirth"
                    type="date"
                    w="full"
                    size="lg"
                    onChange={formik.handleChange}
                    value={formik.values.dateOfBirth}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Typography variant="footnote1" family="robotoMedium">
                    Email
                  </Typography>
                  <Input
                    name="email"
                    type="email"
                    w="full"
                    size="lg"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <Typography variant="footnote2" color="error">
                      * {formik.errors.email}
                    </Typography>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Typography variant="footnote1" family="robotoMedium">
                    Celular
                  </Typography>
                  <Input
                    name="phone"
                    type="phone"
                    w="full"
                    size="lg"
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Typography variant="footnote1" family="robotoMedium">
                    Nº de Matrícula
                  </Typography>
                  <Input
                    name="registrationNumber"
                    type="text"
                    w="full"
                    size="lg"
                    onChange={formik.handleChange}
                    value={formik.values.registrationNumber}
                  />
                  {formik.touched.registrationNumber &&
                    formik.errors.registrationNumber && (
                      <Typography variant="footnote2" color="error">
                        * {formik.errors.registrationNumber}
                      </Typography>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                  <Typography variant="footnote1" family="robotoMedium">
                    Username
                  </Typography>
                  <Input
                    name="username"
                    type="text"
                    w="full"
                    size="lg"
                    onChange={() => {}}
                    value={user.username}
                    disabled
                  />
                </div>
              </div>
              <div className="justify-between flex pt-6">
                <Button
                  color="red"
                  size="md"
                  type="reset"
                  onClick={() => router.push(`/printer-cloud/home`)}
                  label="Cancelar"
                />
                <Button
                  color="blue"
                  size="md"
                  type="submit"
                  disabled={formik.isSubmitting}
                  label="Salvar alterações"
                />
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditProfile;

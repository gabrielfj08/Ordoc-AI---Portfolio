import * as React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import {
  ActionBoxV3 as ActionBox,
  InputV3 as Input,
  TypographyV3 as Typography,
  ButtonV3 as Button,
} from 'printer-ui';
import { useModal, useSession, useV3Snackbar } from '../../../../hooks';
import { ChangePasswordModalProps, ChangePasswordFormValues } from './types';
import PasswordChecklist from '../../../../components/PasswordChecklist';

const initialValues: ChangePasswordFormValues = {
  currentPassword: '',
  password: '',
  passwordConfirmation: '',
};

const ChangePasswordModal = ({ handleSubmit }: ChangePasswordModalProps) => {
  const { closeModal } = useModal();
  const { showV3Snackbar } = useV3Snackbar();
  const { themeColor } = useSession();

  const handleClick = () => {
    closeModal(),
      window.open(`/flow-cidadao/recover-unlock-password`, '_blank');
  };

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Campo obrigatório'),
    password: Yup.string()
      .required('Campo obrigatório')
      .matches(
        /(?=.*\W)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
        'Preencha todos os requisitos abaixo'
      )
      .oneOf(
        [Yup.ref('passwordConfirmation'), null],
        'As senhas não coincidem, verifique por favor.'
      ),
    passwordConfirmation: Yup.string()
      .required('Campo obrigatório')
      .oneOf(
        [Yup.ref('password'), null],
        'As senhas não coincidem, verifique por favor.'
      ),
  });

  return (
    <ActionBox onClose={closeModal} className="sm:w-[700px] w-full h-full">
      <ActionBox.Header
        title="Alterar senha"
        color={themeColor}
        icon="key"
        stroke
        className="w-full"
        subtitle="Aqui você pode alterar sua senha. Insira  a senha atual e atualize a nova senha."
      />

      <ActionBox.Content className="w-full flex-nowrap justify-center">
        <Formik
          onSubmit={(values) =>
            handleSubmit(values)
              .then(() => {
                showV3Snackbar(
                  'Senha alterada com sucesso.',
                  'success',
                  'Senha alterada!'
                ),
                  closeModal();
              })
              .catch((err) => {
                showV3Snackbar(
                  `${err.response.data.message}`,
                  'error',
                  `${
                    err.response.data.message
                      ? 'Falha na alteração dos dados.'
                      : 'Algo deu errado!'
                  }`
                );
              })
          }
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {(formik) => (
            <Form className="w-full">
              <div>
                <Input
                  label="Digite sua senha atual"
                  textColor={themeColor}
                  borderColor={themeColor}
                  focusBorderColor={themeColor}
                  placeholderColor="gray"
                  placeholder="Digite sua senha atual"
                  type="password"
                  name="currentPassword"
                  value={formik.values.currentPassword}
                  w="full"
                  onChange={formik.handleChange}
                  error={
                    formik.values.currentPassword
                      ? !/(?=.*\W)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(
                          formik.values.currentPassword
                        )
                      : formik.touched.currentPassword &&
                        formik.errors.currentPassword
                      ? true
                      : false
                  }
                />
                {formik.touched.currentPassword &&
                formik.errors.currentPassword ? (
                  <Typography variant="label" color="error" family="jakarta">
                    {formik.errors.currentPassword}
                  </Typography>
                ) : null}
              </div>
              <div
                className="flex justify-center mt-3 mb-3 cursor-pointer"
                onClick={() => handleClick()}
              >
                <Typography
                  variant="bodyMd"
                  family="jakartaBold"
                  color={themeColor}
                >
                  Recuperar senha / desbloquear conta
                </Typography>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-full">
                  <Input
                    label="Digite sua nova senha"
                    textColor={themeColor}
                    borderColor={themeColor}
                    focusBorderColor={themeColor}
                    placeholderColor="gray"
                    placeholder="Insira a nova senha"
                    type="password"
                    w="full"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={
                      formik.values.password
                        ? !/(?=.*\W)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(
                            formik.values.password
                          )
                        : formik.touched.password && formik.errors.password
                        ? true
                        : false
                    }
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <Typography variant="label" color="error" family="jakarta">
                      {formik.errors.password}
                    </Typography>
                  ) : null}
                </div>
                <div className="w-full">
                  <Input
                    label="Confirme sua nova senha"
                    textColor={themeColor}
                    borderColor={themeColor}
                    focusBorderColor={themeColor}
                    placeholderColor="gray"
                    type="password"
                    w="full"
                    placeholder="Digite novamente sua senha"
                    name="passwordConfirmation"
                    value={formik.values.passwordConfirmation}
                    onChange={formik.handleChange}
                    error={
                      formik.values.passwordConfirmation
                        ? formik.values.passwordConfirmation !==
                          formik.values.password
                        : formik.touched.passwordConfirmation &&
                          formik.errors.passwordConfirmation
                        ? true
                        : false
                    }
                  />
                  {formik.touched.passwordConfirmation &&
                  formik.errors.passwordConfirmation ? (
                    <Typography variant="label" color="error" family="jakarta">
                      {formik.errors.passwordConfirmation}
                    </Typography>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center justify-center mt-5">
                <PasswordChecklist
                  password={formik.values.password}
                  font="jakarta"
                />
              </div>
              <div className="flex sm:flex-row flex-col sm:justify-between items-center space-y-3 mt-5">
                <Button
                  w={48}
                  label="Cancelar"
                  onClick={closeModal}
                  color={themeColor}
                  style="outlined"
                />
                <Button
                  w={48}
                  color={themeColor}
                  type="submit"
                  label="Enviar"
                  disabled={formik.isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      </ActionBox.Content>
    </ActionBox>
  );
};

export default ChangePasswordModal;

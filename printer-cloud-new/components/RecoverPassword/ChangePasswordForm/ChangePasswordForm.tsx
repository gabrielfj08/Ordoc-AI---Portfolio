import * as React from 'react';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { Typography, Button } from 'printer-ui';
import { useSnackbar } from '../../../hooks';
import { ChangePasswordFormProps } from './types';
import PasswordChecklist from '../../PasswordChecklist';

const ChangePasswordForm = ({ onSubmit }: ChangePasswordFormProps) => {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  return (
    <>
      <Typography
        variant="footnote1"
        color="success"
        family="robotoMedium"
        className="flex flex-col gap-4 items-center"
      >
        Seu código foi validado com sucesso!
        <span className="text-darkGray">Cadastre sua nova senha:</span>
      </Typography>
      <Formik
        initialValues={{
          oneTimePassword: `${router.query.oneTimePassword}`,
          password: '',
          confirmPassword: '',
        }}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit({
            password: values.password,
            oneTimePassword: values.oneTimePassword,
          })
            .then(() => {
              showSnackbar('Senha alterada com sucesso!', 'success');
              router.push('/login');
            })
            .catch((err) => {
              showSnackbar(err.response.data.message, 'error'),
                setSubmitting(false);
            });
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .matches(
              /(?=.*\W)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
              'Preencha todos os requisitos abaixo'
            )
            .required('Campo obrigatório'),
          confirmPassword: Yup.string()
            .required('Campo obrigatório')
            .oneOf([Yup.ref('password'), null], 'As senhas não coincidem'),
        })}
        enableReinitialize
      >
        {(formik) => (
          <Form className="my-4 space-y-8 flex flex-col items-center">
            <div className="w-full">
              <>
                <label
                  htmlFor="password"
                  className="flex flex-col items-center mt-4"
                >
                  <div className="w-full space-y-2 flex flex-col items-center">
                    <Typography variant="footnote1" color="darkGray">
                      Nova senha:
                    </Typography>
                    <Field
                      className="font-roboto-400 text-[15px] placeholder:font-roboto-400 placeholder:text-[15px]
                    placeholder:italic px-4 h-10 rounded border border-darkGray w-full"
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Senha"
                    />
                  </div>
                </label>
                {formik.touched.password && formik.errors.password ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.password}
                  </Typography>
                ) : null}
              </>
              <>
                <label
                  htmlFor="confirmPassword"
                  className="flex flex-col items-center mt-4"
                >
                  <div className="w-full space-y-2 flex flex-col items-center">
                    <Typography variant="footnote1" color="darkGray">
                      Confirme a senha:
                    </Typography>
                    <Field
                      className="font-roboto-400 text-[15px] placeholder:font-roboto-400 placeholder:text-[15px]
                    placeholder:italic px-4 h-10 rounded border border-darkGray w-full"
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder="Confirme a senha"
                    />
                  </div>
                </label>
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.confirmPassword}
                  </Typography>
                ) : null}
              </>
            </div>
            <PasswordChecklist password={formik.values.password} />
            <Button
              type="submit"
              label="Continuar"
              color="info"
              disabled={formik.isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ChangePasswordForm;

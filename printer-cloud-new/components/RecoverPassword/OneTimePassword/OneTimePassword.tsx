import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { Button, Typography } from 'printer-ui';
import { OneTimePasswordFormProps } from './types';
import { useSnackbar } from '../../../hooks';

const OneTimePasswordForm = ({
  onClick,
  onSubmit,
  isLoading,
}: OneTimePasswordFormProps) => {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const fieldClassName =
    'h-12 w-12 font-roboto-400 text-[20px] placeholder:font-roboto-400 placeholder:text-[15px] placeholder:italic p-4 rounded border border-lightGray';

  const useDigitFields = () => {
    const [digitValues, setValue] = React.useState({});

    return {
      handleChange: (e) => {
        const { maxLength, value, name } = e.target;
        const [fieldName, fieldIndex] = name.split('-');

        if (value.length >= maxLength) {
          if (parseInt(fieldIndex, 10) < 6) {
            const nextSibling = document.querySelector<HTMLInputElement>(
              `input[name="otp.digit-${parseInt(fieldIndex, 10) + 1}"]`
            );

            if (nextSibling !== null) {
              nextSibling.focus();
            }
          }
        }

        setValue({
          ...value,
          [`otp.digit-${fieldIndex}`]: value,
        });
      },
    };
  };

  const DigitField = () => {
    const { handleChange } = useDigitFields();

    return (
      <Formik
        initialValues={{
          username: '',
          newPassword: '',
          repeatNewPassword: '',
          otp: {
            'digit-1': '',
            'digit-2': '',
            'digit-3': '',
            'digit-4': '',
            'digit-5': '',
            'digit-6': '',
          },
        }}
        onSubmit={(values) => {
          onSubmit(Object.values(values.otp).join(''))
            .then(() =>
              router.push(
                `/recover-password/${Object.values(values.otp).join('')}`
              )
            )
            .catch((err) => showSnackbar(err.response.data.message, 'error'));
        }}
        validationSchema={Yup.object().shape({
          otp: Yup.object().shape({
            'digit-1': Yup.string().required(),
            'digit-2': Yup.string().required(),
            'digit-3': Yup.string().required(),
            'digit-4': Yup.string().required(),
            'digit-5': Yup.string().required(),
            'digit-6': Yup.string().required(),
          }),
        })}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize
      >
        {(formik) => (
          <Form className="my-4 space-y-8 flex flex-col items-center">
            <label
              htmlFor=""
              className="space-y-3 my-4 flex flex-col items-center"
            >
              <Typography variant="footnote1" color="darkGray">
                Informe o código:
              </Typography>
              <div className="space-x-2">
                <input
                  className={fieldClassName}
                  type="text"
                  name="otp.digit-1"
                  maxLength={1}
                  value={formik.values.otp['digit-1']}
                  onChange={(value) => {
                    handleChange(value);
                    formik.handleChange(value);
                  }}
                />
                <input
                  className={fieldClassName}
                  type="text"
                  name="otp.digit-2"
                  maxLength={1}
                  value={formik.values.otp['digit-2']}
                  onChange={(value) => {
                    handleChange(value);
                    formik.handleChange(value);
                  }}
                />
                <input
                  className={fieldClassName}
                  type="text"
                  name="otp.digit-3"
                  maxLength={1}
                  value={formik.values.otp['digit-3']}
                  onChange={(value) => {
                    handleChange(value);
                    formik.handleChange(value);
                  }}
                />
                <input
                  className={fieldClassName}
                  type="text"
                  name="otp.digit-4"
                  maxLength={1}
                  value={formik.values.otp['digit-4']}
                  onChange={(value) => {
                    handleChange(value);
                    formik.handleChange(value);
                  }}
                />
                <input
                  className={fieldClassName}
                  type="text"
                  name="otp.digit-5"
                  maxLength={1}
                  value={formik.values.otp['digit-5']}
                  onChange={(value) => {
                    handleChange(value);
                    formik.handleChange(value);
                  }}
                />
                <input
                  className={fieldClassName}
                  type="text"
                  name="otp.digit-6"
                  maxLength={1}
                  value={formik.values.otp['digit-6']}
                  onChange={(value) => {
                    handleChange(value);
                    formik.handleChange(value);
                  }}
                />
              </div>
              {formik.errors.otp ? (
                <Typography variant="footnote2" color="error">
                  * Campo obrigatório
                </Typography>
              ) : null}
              <button onClick={onClick} type="button" disabled={isLoading}>
                <Typography
                  variant="footnote1"
                  color={isLoading ? 'gray' : 'info'}
                  family="robotoMedium"
                  className="underline cursor-pointer"
                >
                  Reenviar código
                </Typography>
              </button>
            </label>
            <Button
              type="submit"
              label="Continuar"
              color="info"
              disabled={formik.isSubmitting}
            />
          </Form>
        )}
      </Formik>
    );
  };

  return <DigitField />;
};

export default OneTimePasswordForm;

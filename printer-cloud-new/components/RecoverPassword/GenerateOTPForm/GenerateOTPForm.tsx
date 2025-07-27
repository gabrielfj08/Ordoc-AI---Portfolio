import * as React from 'react';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { Button, Typography } from 'printer-ui';
import { useSnackbar } from '../../../hooks';

const GenerateOTPForm = ({ setOtpPayload, setFormVisibility, onSubmit }) => {
  const [hideForm, setHideForm] = React.useState<boolean>(false);
  const { showSnackbar } = useSnackbar();

  return (
    <div className={hideForm ? 'hidden' : 'block'}>
      <Formik
        initialValues={{ username: '', notification: 'email' }}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values)
            .then((res) => {
              showSnackbar(`${res.message}`, 'success');
              setHideForm(true);
              setFormVisibility(true);
              setOtpPayload(values);
            })
            .catch((err) => {
              showSnackbar(err.response.data.message, 'error');
              setSubmitting(false);
            });
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().required('Campo obrigatório'),
        })}
        enableReinitialize
      >
        {(formik) => (
          <Form>
            <label
              htmlFor="username"
              className="flex flex-col items-center mt-4"
            >
              <div className="flex flex-col items-center">
                <Typography
                  variant="footnote1"
                  color="darkGray"
                  className="mb-3"
                >
                  Informe o username:
                </Typography>
                <Field
                  className="font-roboto-400 text-[15px] placeholder:font-roboto-400 placeholder:text-[15px]
                placeholder:italic px-4 h-10 rounded border border-darkGray w-full mb-1"
                  type="text"
                  name="username"
                  id="username"
                  placeholder="username"
                />
              </div>
            </label>
            {formik.errors.username ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.username}
              </Typography>
            ) : null}

            <div className="flex flex-col items-center space-y-3 my-8">
              <Typography variant="footnote1" color="darkGray">
                Receber código via:
              </Typography>
              <div className="flex space-x-6">
                <label htmlFor="sms" className="flex space-x-2 items-center">
                  <Field
                    type="radio"
                    name="notification"
                    id="sms"
                    value="sms"
                  />
                  <Typography variant="footnote1" color="darkGray">
                    SMS
                  </Typography>
                </label>
                <label htmlFor="email" className="flex space-x-2 items-center">
                  <Field
                    type="radio"
                    name="notification"
                    id="email"
                    value="email"
                  />
                  <Typography variant="footnote1" color="darkGray">
                    E-mail
                  </Typography>
                </label>
              </div>
            </div>
            <div className="flex justify-center my-10">
              <Button
                label="Gerar código"
                color="info"
                type="submit"
                disabled={formik.isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default GenerateOTPForm;

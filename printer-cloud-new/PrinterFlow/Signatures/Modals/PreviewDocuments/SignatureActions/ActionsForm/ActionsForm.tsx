import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Button, TextArea, Typography } from 'printer-ui';
import { noEmojiValidator } from '../../../../../../utils';
import { useModal, useSnackbar } from '../../../../../../hooks';
import { SignatureActionsFormProps } from './types';

const SignatureActionsForm = ({
  onClose,
  onSubmit,
}: SignatureActionsFormProps) => {
  const { showSnackbar } = useSnackbar();
  const { closeModal } = useModal();

  const initialValues = {
    note: '',
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          onSubmit(values)
            .then(() => {
              closeModal();
              showSnackbar('Assinatura recusada com sucesso', 'success');
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
          note: Yup.string()
            .required('Campo obrigatório')
            .test(
              'regex',
              'Não utilize emojis (desenhos ou pictogramas).',
              noEmojiValidator
            ),
        })}
      >
        {(formik) => (
          <Form>
            <div className="sm:flex sm:space-x-4">
              <label htmlFor="note" className="grow">
                <Typography
                  variant="footnote1"
                  family="robotoMedium"
                  className="py-3"
                >
                  Descreva a justificativa da recusa*:
                </Typography>
                <TextArea
                  name="note"
                  className="w-full px-5 py-4"
                  rows={3}
                  value={formik.values.note}
                  onChange={formik.handleChange}
                />
                {formik.errors.note ? (
                  <Typography
                    variant="footnote2"
                    color="error"
                    className="pb-2 sm:pb-0"
                  >
                    * {formik.errors.note}
                  </Typography>
                ) : null}
              </label>
              <div className="flex gap-2 justify-between sm:justify-center sm:flex-col-reverse sm:mt-8 mt-3">
                <Button
                  label="Cancelar"
                  color="gray"
                  type="button"
                  className="sm:mt-5"
                  onClick={onClose}
                />
                <Button
                  label="Confirmar recusa"
                  color="error"
                  type="submit"
                  disabled={formik.isSubmitting}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignatureActionsForm;

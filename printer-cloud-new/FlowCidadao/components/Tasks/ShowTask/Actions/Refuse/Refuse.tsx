import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import {
  ButtonV3 as Button,
  TextAreaV3 as TextArea,
  TypographyV3 as Typography,
} from 'printer-ui';
import { noEmojiValidator } from '../../../../../../utils';
import { useSession, useV3Snackbar } from '../../../../../../hooks';
import { RefuseExternalTaskModalProps } from './types';

const RefuseExternalTaskModal = ({
  onSubmit,
  justificationModalVisibility,
  setJustificationModalVisibility,
}: RefuseExternalTaskModalProps) => {
  const { themeColor } = useSession();
  const { showV3Snackbar } = useV3Snackbar();

  const initialValues = {
    note: '',
  };

  return (
    <div className={justificationModalVisibility ? 'block' : 'hidden'}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          onSubmit(values)
            .then(() => {
              showV3Snackbar(
                `Sua recusa foi enviada com sucesso.`,
                'success',
                'Sucesso!'
              );
            })
            .catch((error) => {
              showV3Snackbar(
                error.response.data.message,
                'error',
                'Algo deu errado!'
              );
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
            <div className="w-full">
              <TextArea
                name="note"
                w="full"
                rows={3}
                label="Justificativa"
                color={themeColor}
                value={formik.values.note}
                onChange={formik.handleChange}
                placeholder="Por favor, justifique sua recusa."
              />
              {formik.touched.note && formik.errors.note ? (
                <Typography variant="bodyMd" color="error">
                  * {formik.errors.note}
                </Typography>
              ) : null}
            </div>
            <div className="flex space-x-4 sm:justify-end justify-center mt-2">
              <Button
                w={60}
                type="button"
                color={themeColor}
                style="outlined"
                label="Cancelar"
                onClick={() => setJustificationModalVisibility(false)}
              />
              <Button
                w={60}
                type="submit"
                label="Recusar tarefa"
                color={themeColor}
                disabled={!formik.values.note || formik.isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RefuseExternalTaskModal;

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
import { AddExternalCommentModalProps } from './types';

const AddExternalCommentModal = ({
  onSubmit,
  commentModalVisibility,
  setCommentModalVisibility,
}: AddExternalCommentModalProps) => {
  const { showV3Snackbar } = useV3Snackbar();
  const { themeColor } = useSession();
  const initialValues = {
    body: '',
  };

  return (
    <div className={commentModalVisibility ? 'block' : 'hidden'}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values)
            .then(() => {
              showV3Snackbar(
                `Comentário adicionado com sucesso.`,
                'success',
                'Sucesso!'
              );
              setCommentModalVisibility(false);
              resetForm();
            })
            .catch((error) => {
              showV3Snackbar(
                error.response.data.message,
                'error',
                'Algo deu errado!'
              );
            });
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          body: Yup.string()
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
                name="body"
                w="full"
                rows={4}
                label="Adicionar comentário"
                color={themeColor}
                value={formik.values.body}
                onChange={formik.handleChange}
                placeholder="Adicione seu comentário aqui."
              />
              {formik.touched.body && formik.errors.body ? (
                <Typography variant="label" color="error">
                  * {formik.errors.body}
                </Typography>
              ) : null}
            </div>
            <div className="flex space-x-4 sm:justify-end justify-center mt-2">
              <Button
                w={60}
                size="sm"
                type="button"
                color={themeColor}
                style="outlined"
                label="Cancelar"
                onClick={() => setCommentModalVisibility(false)}
              />
              <Button
                w={60}
                size="sm"
                type="submit"
                label="Salvar"
                color={themeColor}
                disabled={!formik.values.body || formik.isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddExternalCommentModal;

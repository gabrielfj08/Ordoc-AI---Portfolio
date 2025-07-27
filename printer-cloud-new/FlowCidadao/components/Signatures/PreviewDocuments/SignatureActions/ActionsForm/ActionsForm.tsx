import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import {
  TextAreaV3 as TextArea,
  TypographyV3 as Typography,
  ButtonV3 as Button,
  CheckboxV3 as Checkbox,
} from 'printer-ui';
import { noEmojiValidator } from '../../../../../../utils';
import { useModal, useSession, useV3Snackbar } from '../../../../../../hooks';
import { SignatureExternalActionsFormProps } from './types';

const initialValues = {
  note: '',
  checkbox: false,
};

const SignatureExternalActionsForm = ({
  onSubmit,
  onClose,
}: SignatureExternalActionsFormProps) => {
  const { showV3Snackbar } = useV3Snackbar();
  const { closeModal } = useModal();
  const { themeColor } = useSession();

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          onSubmit(values)
            .then(() => {
              closeModal();
              showV3Snackbar(
                'O documento não foi assinado',
                'success',
                'Recusa efetuada com sucesso.'
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
        validateOnBlur={false}
        validateOnChange={false}
        enableReinitialize
        validationSchema={Yup.object().shape({
          note: Yup.string()
            .required('Campo obrigatório')
            .test(
              'regex',
              'Não utilize emojis (desenhos ou pictogramas).',
              noEmojiValidator
            ),
          checkbox: Yup.bool().oneOf(
            [true],
            'Marque a caixa acima para prosseguir'
          ),
        })}
      >
        {(formik) => (
          <Form>
            <div className="mt-3 items-center space-y-1">
              <label htmlFor="note" className="grow">
                <TextArea
                  name="note"
                  w="full"
                  rows={3}
                  label="Justificativa"
                  color={themeColor}
                  value={formik.values.note}
                  onChange={formik.handleChange}
                  placeholder="Se deseja recusar a assinatura desse processo, escreva uma justificativa para que o solicitante saiba a razão."
                />
                {formik.errors.note ? (
                  <Typography family="jakarta" variant="label" color="error">
                    * {formik.errors.note}
                  </Typography>
                ) : null}
              </label>
              <div className="flex space-x-3 items-center justify-center p-1">
                <span>
                  <Checkbox
                    id="checkbox"
                    name="checkbox"
                    onChange={formik.handleChange}
                    checked={formik.values.checkbox}
                    color={themeColor}
                  />
                </span>
                <label htmlFor="checkbox" className="cursor-pointer">
                  <Typography
                    variant="bodySm"
                    family="jakarta"
                    color="darkGray"
                  >
                    Estou ciente que este documento precisa da minha assinatura,
                    porém me recuso assiná-lo conforme justificado acima.
                  </Typography>
                </label>
              </div>
              <div className="flex justify-center">
                {formik.touched.checkbox && formik.errors.checkbox ? (
                  <Typography variant="label" color="error" family="jakarta">
                    * {formik.errors.checkbox}
                  </Typography>
                ) : null}
              </div>
              <div className="sm:flex sm:flex-row flex flex-col items-center justify-center space-y-4 sm:space-y-0 sm:space-x-3  mt-4">
                <Button
                  w={60}
                  label="Cancelar"
                  color={themeColor}
                  style="outlined"
                  type="button"
                  onClick={onClose}
                />
                <Button
                  w={60}
                  label="Recusar"
                  color={themeColor}
                  type="submit"
                  disabled={formik.isSubmitting || !formik.values.checkbox}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignatureExternalActionsForm;

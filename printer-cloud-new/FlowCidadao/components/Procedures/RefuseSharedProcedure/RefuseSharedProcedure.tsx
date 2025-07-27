import * as React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import {
  ActionBoxV3 as ActionBox,
  TextAreaV3 as TextArea,
  ButtonV3 as Button,
  TypographyV3 as Typography,
} from 'printer-ui';
import { noEmojiValidator } from '../../../../utils';
import { useModal, useSession, useV3Snackbar } from '../../../../hooks';
import { RefuseSharedProcedureModalProps } from './types';

const initialValues = {
  note: '',
};

const RefuseSharedProcedureModal = ({
  onSubmit,
}: RefuseSharedProcedureModalProps) => {
  const { showV3Snackbar } = useV3Snackbar();
  const { themeColor } = useSession();
  const { closeModal } = useModal();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        onSubmit(values)
          .then(() => {
            closeModal();
            showV3Snackbar(
              'Este processo não faz mais parte de sua lista de processos compartilhados.',
              'success',
              'Compartilhamento recusado'
            );
          })
          .catch((error) => {
            showV3Snackbar(
              error.response.data.message,
              'error',
              'Algo deu errado.'
            );
          })
          .finally(() => {
            actions.setSubmitting(false);
          });
      }}
      validateOnBlur={false}
      validationSchema={Yup.object().shape({
        note: Yup.string()
          .required('Campo obrigatório')
          .test(
            'regex',
            'Não utilize emojis (desenhos ou pictogramas).',
            noEmojiValidator
          ),
      })}
      validateOnChange={false}
      enableReinitialize
    >
      {(formik) => (
        <Form>
          <ActionBox className="w-full" onClose={closeModal}>
            <ActionBox.Header
              title="Descartar solicitação de compartilhamento"
              color={themeColor}
              className="w-full"
              stroke
              subtitle="Após o envio da justificativa o processo sairá da sua lista."
              icon="userShare"
            />
            <ActionBox.Content className="w-full">
              <TextArea
                name="note"
                label="Justificativa"
                placeholder="Por que deseja descartar o compartilhamento? Descreva de forma resumida."
                w="full"
                rows={4}
                color={themeColor}
                onChange={formik.handleChange}
                value={formik.values.note}
              />
              {formik.touched.note && formik.errors.note ? (
                <Typography variant="label" color="error">
                  * {formik.errors.note}
                </Typography>
              ) : null}
              <div className="pt-3 flex justify-between space-x-2 sm:space-x-0">
                <Button
                  label="Cancelar"
                  color={themeColor}
                  style="outlined"
                  onClick={closeModal}
                  w={60}
                />
                <Button
                  label="Enviar"
                  color={themeColor}
                  disabled={formik.isSubmitting || !formik.values.note}
                  type="submit"
                  w={60}
                />
              </div>
            </ActionBox.Content>
          </ActionBox>
        </Form>
      )}
    </Formik>
  );
};

export default RefuseSharedProcedureModal;

import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { ActionBox, Typography, TextArea, Button, Checkbox } from 'printer-ui';
import { noEmojiValidator } from '../../../../utils';
import { useModal, useSnackbar } from '../../../../hooks';
import { UnarchiveProcedureModalProps } from './types';

const UnarchiveProcedureModal = ({
  onSubmit,
  processNumber,
}: UnarchiveProcedureModalProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const initialValues = {
    checkbox: false,
    note: '',
  };

  return (
    <ActionBox className="max-w-full">
      <ActionBox.Header
        title="Desarquivar processo"
        color="blue"
        icon="proceduresV3"
        stroke
        onClose={closeModal}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          onSubmit(values)
            .then(() => {
              closeModal();
              showSnackbar(`Processo desarquivado com sucesso.`, 'success');
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
          checkbox: Yup.bool().oneOf(
            [true],
            'Marque a caixa acima para prosseguir'
          ),
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
            <ActionBox.Content>
              <div className="sm:w-[569px] space-y-4">
                <div className="overflow-hidden sm:w-auto w-72">
                  <Typography variant="headline" family="roboto">
                    Está ação irá desarquivar o processo:
                  </Typography>
                </div>
                <Typography
                  variant="headline"
                  family="robotoMedium"
                  color="blue"
                >
                  {processNumber}
                </Typography>
                <span className="flex space-x-2 justify-start items-center pt-2">
                  <Checkbox
                    id="checkbox"
                    name="checkbox"
                    onChange={formik.handleChange}
                    checked={formik.values.checkbox}
                  />
                  <label htmlFor="checkbox" className="cursor-pointer">
                    <Typography variant="headline" family="roboto">
                      Estou ciente que irei desarquivar o processo.
                    </Typography>
                  </label>
                </span>
                {formik.errors.checkbox ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.checkbox}
                  </Typography>
                ) : null}
                <Typography variant="headline" family="robotoMedium">
                  Descreva a justificativa do desarquivamento*:
                </Typography>
                <div className="sm:hidden block">
                  <TextArea
                    name="note"
                    className="px-5"
                    cols={26}
                    rows={2}
                    onChange={formik.handleChange}
                    value={formik.values.note}
                  />
                </div>
                <div className="hidden sm:block w-72">
                  <TextArea
                    name="note"
                    className="px-5"
                    cols={57}
                    rows={3}
                    onChange={formik.handleChange}
                    value={formik.values.note}
                  />
                </div>
                {formik.touched.note && formik.errors.note ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.note}
                  </Typography>
                ) : null}
              </div>
            </ActionBox.Content>
            <ActionBox.Footer>
              <Button
                type="button"
                onClick={closeModal}
                label="Cancelar"
                color="error"
              />
              <Button
                type="submit"
                color="info"
                label="Desarquivar processo"
                disabled={formik.isSubmitting}
              />
            </ActionBox.Footer>
          </Form>
        )}
      </Formik>
    </ActionBox>
  );
};

export default UnarchiveProcedureModal;

import * as React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { ActionBox, Button, TextArea, Typography } from 'printer-ui';
import { noEmojiValidator } from '../../../../../utils';
import { useModal, useSnackbar } from '../../../../../hooks';
import { RefuseTaskModalAppendiceProps } from './types';

const RefuseTaskModalAppendice = ({
  justificationModalVisibility,
  setJustificationModalVisibility,
  onSubmit,
}: RefuseTaskModalAppendiceProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const initialValues = {
    note: '',
  };

  return (
    <ActionBox className="sm:w-[569px]">
      <div className={justificationModalVisibility ? 'block' : 'hidden'}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            onSubmit(values)
              .then(() => {
                closeModal();
                showSnackbar(`Tarefa recusada com sucesso.`, 'success');
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
              <ActionBox.Content>
                <div className="w-full min-w-[320px] space-y-4">
                  <Typography variant="footnote1" family="robotoBold">
                    Descreva a justificativa da recusa*:
                  </Typography>

                  <div className="sm:hidden block">
                    <TextArea
                      name="note"
                      rows={2}
                      cols={30}
                      className="px-5"
                      onChange={formik.handleChange}
                      value={formik.values.note}
                    />
                    {formik.touched.note && formik.errors.note ? (
                      <Typography variant="footnote2" color="error">
                        * {formik.errors.note}
                      </Typography>
                    ) : null}
                  </div>
                  <div className="hidden sm:block">
                    <TextArea
                      name="note"
                      className="px-5"
                      cols={51}
                      rows={3}
                      onChange={formik.handleChange}
                      value={formik.values.note}
                    />
                    {formik.touched.note && formik.errors.note ? (
                      <Typography variant="footnote2" color="error">
                        * {formik.errors.note}
                      </Typography>
                    ) : null}
                  </div>
                </div>
              </ActionBox.Content>
              <ActionBox.Footer>
                <Button
                  type="button"
                  color="gray"
                  label="Cancelar"
                  onClick={() => setJustificationModalVisibility(false)}
                />
                <Button
                  type="submit"
                  color="error"
                  label="Confirmar recusa"
                  disabled={formik.isSubmitting}
                />
              </ActionBox.Footer>
            </Form>
          )}
        </Formik>
      </div>
    </ActionBox>
  );
};

export default RefuseTaskModalAppendice;

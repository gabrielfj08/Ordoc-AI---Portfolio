import * as React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import {
  ActionBoxV3 as ActionBox,
  ButtonV3 as Button,
  CheckboxV3 as Checkbox,
  TextAreaV3 as TextArea,
  TypographyV3 as Typography,
} from 'printer-ui';
import { noEmojiValidator } from '../../../../utils';
import { useModal, useSession, useV3Snackbar } from '../../../../hooks';
import { FinishProcedureModalProps } from './types';

const FinishProcedureModal = ({ onSubmit }: FinishProcedureModalProps) => {
  const { session } = useSession();
  const { closeModal } = useModal();
  const { showV3Snackbar } = useV3Snackbar();

  const sessionColor = !!session.organization?.theme
    ? session.organization.theme.color
    : 'cidOrange';

  const initialValues = {
    description: '',
    checkbox: false,
  };

  return (
    <ActionBox onClose={closeModal} className="h-fit sm:w-[569px]">
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            onSubmit(values)
              .then(() => {
                closeModal();
                showV3Snackbar(
                  'Sua solicitação foi enviada com sucesso.',
                  'success',
                  'Cancelamento solicitado!'
                );
              })
              .catch((error) => {
                if (
                  (error.response.status = 422 && error.response.status < 500)
                ) {
                  showV3Snackbar(
                    'Sua solicitação já foi enviada anteriormente, por favor aguarde!',
                    'error',
                    'Solicitação falhou.'
                  );
                } else {
                  showV3Snackbar(
                    error.response.data.message,
                    'error',
                    'Algo deu errado!'
                  );
                }
              })
              .finally(() => {
                actions.setSubmitting(false);
              });
          }}
          enableReinitialize
          validationSchema={Yup.object().shape({
            description: Yup.string()
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
              <ActionBox.Header
                title="Solicitar cancelamento"
                subtitle="Após o pedido sua solicitação será analisada."
                color={sessionColor}
                icon="circleClose"
                stroke
              />
              <ActionBox.Content className="space-y-4 mt-4">
                <div>
                  <TextArea
                    type="text"
                    label="Justificativa"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    color={sessionColor}
                    w="full"
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <Typography variant="label" color="error" family="jakarta">
                      * {formik.errors.description}
                    </Typography>
                  ) : null}
                </div>
                <div className="flex space-x-3 items-center">
                  <span>
                    <Checkbox
                      id="checkbox"
                      name="checkbox"
                      onChange={formik.handleChange}
                      checked={formik.values.checkbox}
                      color={sessionColor}
                    />
                  </span>
                  <label htmlFor="checkbox" className="cursor-pointer">
                    <Typography
                      variant="bodyMd"
                      family="jakarta"
                      color="darkGray"
                    >
                      Estou ciente que estou solicitando o cancelamento de um
                      processo e que isto não pode ser desfeito.
                    </Typography>
                  </label>
                </div>
                <div>
                  {formik.touched.checkbox && formik.errors.checkbox ? (
                    <Typography variant="label" color="error" family="jakarta">
                      * {formik.errors.checkbox}
                    </Typography>
                  ) : null}
                </div>
                <div className="flex space-x-4">
                  <Button
                    w="full"
                    type="button"
                    label="Cancelar"
                    onClick={closeModal}
                    color={sessionColor}
                    style="outlined"
                  />
                  <Button
                    w="full"
                    type="submit"
                    label="Enviar"
                    color={sessionColor}
                    disabled={formik.isSubmitting}
                  />
                </div>
              </ActionBox.Content>
            </Form>
          )}
        </Formik>
      </div>
    </ActionBox>
  );
};

export default FinishProcedureModal;

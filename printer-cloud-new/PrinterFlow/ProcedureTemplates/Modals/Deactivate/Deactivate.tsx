import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { ActionBox, Typography, TextArea, Button, Checkbox } from 'printer-ui';
import { noEmojiValidator } from '../../../../utils';
import { useModal, useSnackbar } from '../../../../hooks';
import { DeactivateProcedureTemplateModalProps } from './types';

const DeactivateProcedureTemplateModal = ({
  onSubmit,
  procedureTemplateName,
  parentProcedureTemplateId,
}: DeactivateProcedureTemplateModalProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const initialValues = {
    checkbox: false,
    note: '',
  };

  const procedureTemplateType =
    parentProcedureTemplateId === null ? 'tipo de processo' : 'assunto';

  const procedureTemplateSnackbar =
    parentProcedureTemplateId === null ? 'Tipo de processo' : 'Assunto';

  return (
    <ActionBox className="max-w-full">
      <ActionBox.Header
        title={`Desativar ${procedureTemplateType}`}
        color="error"
        icon="procedureTemplateV3"
        fill
        stroke
        onClose={closeModal}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          onSubmit(values)
            .then(() => {
              closeModal();
              showSnackbar(
                `${procedureTemplateSnackbar} desativado com sucesso.`,
                'success'
              );
            })
            .catch((error) => {
              showSnackbar(error.response.data.message, 'error');
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
                <Typography
                  variant="headline"
                  family="robotoMedium"
                  color="blue"
                >
                  {procedureTemplateName}
                </Typography>

                {formik.errors.checkbox ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.checkbox}
                  </Typography>
                ) : null}
                <Typography variant="headline" family="robotoMedium">
                  Descreva a justificativa da desativação*:
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
                <Typography variant="headline" family="roboto">
                  Ao clicar em desativar, ele será desativado do Printer Flow,
                  porém, poderá ser reativado a qualquer momento.
                </Typography>
                <span className="flex space-x-2 justify-start items-center">
                  <Checkbox
                    id="checkbox"
                    name="checkbox"
                    onChange={formik.handleChange}
                    checked={formik.values.checkbox}
                  />
                  <label htmlFor="checkbox" className="cursor-pointer">
                    <Typography variant="headline" family="roboto">
                      {`Estou ciente que irei desativar o ${procedureTemplateType}.`}
                    </Typography>
                  </label>
                </span>
              </div>
            </ActionBox.Content>
            <ActionBox.Footer>
              <Button type="button" onClick={closeModal} label="Cancelar" />
              <Button
                type="submit"
                color="error"
                label="Desativar"
                disabled={formik.isSubmitting}
              />
            </ActionBox.Footer>
          </Form>
        )}
      </Formik>
    </ActionBox>
  );
};

export default DeactivateProcedureTemplateModal;

import * as React from 'react';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { ActionBox, Button, Checkbox, Typography } from 'printer-ui';
import { useModal, useSnackbar, useSession } from '../../../../../hooks';
import { SetTaskAssigneeModalProps } from '../types';
import SelectGroupRequesters from '../../../SelectGroupRequesters';

const SetAssigneeTaskModalAppendice = ({
  onSubmit,
  task,
  procedure,
}: SetTaskAssigneeModalProps) => {
  const { session } = useSession();
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const initialValues = {
    checkbox: false,
    groupAssigneeId: null,
    responsibleAssignee: '',
  };

  return (
    <ActionBox>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          const payload = {
            checkbox: values.checkbox,
            groupAssigneeId:
              values.responsibleAssignee === 'externalRequester'
                ? procedure.requester.id
                : values.groupAssigneeId,
          };
          onSubmit(payload)
            .then(() => {
              closeModal();
              showSnackbar(`Tarefa atribuída com sucesso.`, 'success');
            })
            .catch((error) => {
              showSnackbar(error.response.data.message, 'error');
            })
            .finally(() => {
              actions.setSubmitting(false);
            });
        }}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize
        validationSchema={Yup.object().shape({
          checkbox: Yup.bool().oneOf(
            [true],
            'Marque a caixa acima para prosseguir'
          ),
        })}
      >
        {(formik) => (
          <Form>
            <ActionBox.Content>
              <div className="w-full min-w-[320px] space-y-4">
                <Typography variant="footnote1" family="robotoMedium">
                  Destino:
                </Typography>
                {procedure?.createdBy?.id === session.externalUserId && (
                  <div className="flex space-x-4 pb-2">
                    <label
                      htmlFor="externalRequester"
                      className="flex items-center space-x-2 pb-2 pr-5 sm:pr-16"
                    >
                      <Field
                        type="radio"
                        value="externalRequester"
                        name="responsibleAssignee"
                        id="externalRequester"
                      />
                      <Typography variant="footnote1">
                        Solicitante externo
                      </Typography>
                    </label>
                    <label
                      htmlFor="groupRequester"
                      className="flex items-center space-x-2 pb-2 pr-5 sm:pr-16"
                    >
                      <Field
                        type="radio"
                        value="groupRequester"
                        name="responsibleAssignee"
                        id="groupRequester"
                      />
                      <Typography variant="footnote1">
                        Grupo responsável
                      </Typography>
                    </label>
                  </div>
                )}
                {(formik.values.responsibleAssignee === 'groupRequester' ||
                  procedure?.createdBy?.id !== session.externalUserId) && (
                  <SelectGroupRequesters
                    name="groupAssigneeId"
                    groupRequester={task.groupAssignee}
                  />
                )}
              </div>
              <div className="flex space-x-2 mt-4 pb-2">
                <Checkbox
                  id="checkbox"
                  name="checkbox"
                  onChange={formik.handleChange}
                  checked={formik.values.checkbox}
                />
                <label htmlFor="checkbox" className="cursor-pointer">
                  <Typography variant="footnote1">
                    Ao atribuir a tarefa, estou ciente de que a edição dos
                    campos será desabilitada.
                  </Typography>
                </label>
              </div>
              {formik.errors.checkbox ? (
                <Typography variant="footnote2" color="error">
                  * {formik.errors.checkbox}
                </Typography>
              ) : null}
            </ActionBox.Content>
            <ActionBox.Footer>
              <div className="w-full flex justify-end">
                <Button
                  type="submit"
                  color="info"
                  label="Atribuir tarefa"
                  disabled={formik.isSubmitting}
                />
              </div>
            </ActionBox.Footer>
          </Form>
        )}
      </Formik>
    </ActionBox>
  );
};

export default SetAssigneeTaskModalAppendice;

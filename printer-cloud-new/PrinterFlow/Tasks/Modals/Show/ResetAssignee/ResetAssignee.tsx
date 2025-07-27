import * as React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Typography } from 'printer-ui';
import { queryClient } from '../../../../../queryClient';
import { useAuth, useModal, useSnackbar } from '../../../../../hooks';
import SelectGroupRequesters from '../../../SelectGroupRequesters';
import { ResetAssigneeFormProps, ResetTaskAssigneeFormValues } from './types';

const ResetAssigneeForm = ({
  task,
  setResetGroupAssignee,
  resetGroupAssignee,
  onSubmit,
}: ResetAssigneeFormProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();
  const { token, subdomain } = useAuth();

  const initialValues = {
    note: '',
    groupAssigneeId: task.groupAssigneeId,
  } as ResetTaskAssigneeFormValues;

  return (
    <div className={resetGroupAssignee ? 'block' : 'hidden'}>
      <Formik
        onSubmit={(values, actions) => {
          onSubmit(values)
            .then((res) => {
              showSnackbar('Tarefa reatribuída com sucesso.', 'success');
              setResetGroupAssignee(false);
              closeModal();
              queryClient.invalidateQueries(['tasks', subdomain, token]);
              queryClient.invalidateQueries([
                'tasksStarted',
                subdomain,
                token,
                {},
              ]);
            })
            .catch((err) => {
              showSnackbar(err.response.data.message, 'error');
            })
            .finally(() => {
              actions.setSubmitting(false);
            });
        }}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          note: Yup.string().required('Campo obrigatório'),
          groupAssigneeId: Yup.number().required('Campo obrigatório'),
        })}
      >
        {(formik) => (
          <Form>
            <div className="grid sm:grid-cols-2 justify-between sm:items-center">
              <div className="space-y-2 sm:w-[245px]">
                <Typography variant="footnote1" family="robotoMedium">
                  Destino*:
                </Typography>
                <SelectGroupRequesters
                  name="groupAssigneeId"
                  groupRequester={
                    task.groupAssignee ? task.groupAssignee : null
                  }
                />
              </div>

              <div className="space-y-2 sm:mt-0 mt-2">
                <Typography variant="footnote1" family="robotoMedium">
                  Justificativa*:
                </Typography>
                <Input
                  type="text"
                  name="note"
                  value={formik.values.note}
                  onChange={formik.handleChange}
                  size="md"
                  w="full"
                />
              </div>
            </div>
            <div className="flex justify-end">
              {formik.touched.groupAssigneeId &&
              formik.errors.groupAssigneeId ? (
                <Typography variant="footnote2" color="error">
                  * {formik.errors.groupAssigneeId}
                </Typography>
              ) : null}
              {formik.touched.note && formik.errors.note ? (
                <Typography variant="footnote2" color="error">
                  * {formik.errors.note}
                </Typography>
              ) : null}
            </div>

            <div className="flex justify-between py-2">
              <Button
                size="sm"
                type="button"
                color="error"
                label="Cancelar"
                outlined
                onClick={() => setResetGroupAssignee(false)}
              />
              <Button
                size="sm"
                type="submit"
                color="info"
                label="Redefinir"
                outlined
                disabled={formik.isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetAssigneeForm;

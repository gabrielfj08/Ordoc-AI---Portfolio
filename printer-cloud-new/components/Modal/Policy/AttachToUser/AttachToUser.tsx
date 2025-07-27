import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { ActionBox, Button, Typography } from 'printer-ui';
import { useModal } from '../../../../hooks';
import { AttachPolicyToUserProps } from './types';
import AttachPolicyToUserSelect from './AttachPolicyToUserSelect';

const AttachToUser = ({ onSubmit }: AttachPolicyToUserProps) => {
  const { closeModal } = useModal();

  const validationSchema = Yup.object().shape({
    id: Yup.number().typeError('Selecione um usuário para prosseguir'),
  });

  return (
    <ActionBox>
      <Formik
        initialValues={{ id: null }}
        onSubmit={(values) => onSubmit(values)}
        enableReinitialize
        validationSchema={validationSchema}
      >
        {(formik) => (
          <Form>
            <ActionBox.Header
              title="Adicionar novo usuário"
              color="blue"
              icon="user"
              stroke
              onClose={closeModal}
            />
            <ActionBox.Content>
              <div className="sm:w-[569px] space-y-2">
                <AttachPolicyToUserSelect />
                {formik.touched.id && formik.errors.id ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.id}
                  </Typography>
                ) : null}
              </div>
            </ActionBox.Content>
            <ActionBox.Footer>
              <Button type="button" onClick={closeModal} label="Cancelar" />
              <Button
                color="blue"
                type="submit"
                disabled={formik.isSubmitting}
                label="Adicionar usuário"
              />
            </ActionBox.Footer>
          </Form>
        )}
      </Formik>
    </ActionBox>
  );
};

export default AttachToUser;

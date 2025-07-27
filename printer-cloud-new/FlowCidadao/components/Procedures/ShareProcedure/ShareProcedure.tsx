import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { queryClient } from '../../../../queryClient';
import {
  ActionBoxV3 as ActionBox,
  ButtonV3 as Button,
  InputV3 as Input,
  TypographyV3 as Typography,
} from 'printer-ui';
import {
  useAuth,
  useExternalAuth,
  useModal,
  useSession,
  useV3Snackbar,
} from '../../../../hooks';
import { cpfCnpjMask } from '../../../../utils';
import { ShareProcedureFormValues, ShareProcedureModalProps } from './types';
import SharedRequesters from './SharedRequesters';

const ShareProcedureModal = ({
  sharedProcedures,
  procedure,
  onSubmit,
}: ShareProcedureModalProps) => {
  const { closeModal } = useModal();
  const { themeColor } = useSession();
  const { showV3Snackbar } = useV3Snackbar();
  const { externalToken } = useExternalAuth();
  const { subdomain } = useAuth();

  const initialValues: ShareProcedureFormValues = {
    cpfCnpj: '',
    procedureId: procedure.id,
  };

  const validationSchema = Yup.object().shape({
    cpfCnpj: Yup.string()
      .test(
        'length',
        'Por favor, revise seus dados.',
        (value) =>
          value?.match(/^(\d[-./]?){11}$/) || value?.match(/^(\d[-./]?){14}$/)
      )
      .required('Este campo é obrigatório'),
  });

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        onSubmit(values)
          .then(() => {
            queryClient.invalidateQueries([
              'externalSharedProcedure',
              externalToken,
              subdomain,
            ]);
            showV3Snackbar(
              'Seu processo foi compartilhado com o usuário e ele receberá uma notificação.',
              'success',
              'Compartilhamento concluído!'
            );
            actions.resetForm();
          })
          .catch((err) =>
            showV3Snackbar(
              `${err.response.data.message}`,
              'error',
              'Algo deu errado!'
            )
          )
          .finally(() => {
            actions.setSubmitting(false);
          });
      }}
      validateOnBlur={false}
      enableReinitialize
    >
      {(formik) => (
        <Form className="w-full">
          <ActionBox
            className="sm:w-[569px] min-w-[320px]"
            onClose={closeModal}
          >
            <ActionBox.Header
              title={`Compartilhar processo ${procedure.processNumber}`}
              color={themeColor}
              className="w-full"
              stroke
              subtitle="Compartilhe este processo com algum usuário."
              icon="userShare"
            />
            <ActionBox.Content className="w-full">
              <Input
                name="cpfCnpj"
                onChange={formik.handleChange}
                value={cpfCnpjMask(formik.values.cpfCnpj)}
                label="CPF ou CNPJ"
                textColor={themeColor}
                borderColor={themeColor}
                focusBorderColor={themeColor}
                placeholder="Digite os dados do usuário"
                w="full"
                maxLength={18}
                error={!!formik.errors.cpfCnpj}
              />
              {formik.touched.cpfCnpj && formik.errors.cpfCnpj ? (
                <Typography variant="label" color="error">
                  {formik.errors.cpfCnpj}
                </Typography>
              ) : null}

              <SharedRequesters sharedProcedures={sharedProcedures} />

              <div className="pt-3 flex justify-between">
                <Button
                  label="Cancelar"
                  color={themeColor}
                  style="outlined"
                  onClick={() => {
                    closeModal();
                  }}
                />
                <Button
                  label="Compartilhar"
                  color={themeColor}
                  disabled={formik.isSubmitting || !formik.values.cpfCnpj}
                  type="submit"
                />
              </div>
            </ActionBox.Content>
          </ActionBox>
        </Form>
      )}
    </Formik>
  );
};

export default ShareProcedureModal;

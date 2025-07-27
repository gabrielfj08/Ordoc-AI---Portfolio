import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { ButtonV3 as Button } from 'printer-ui';
import { useV3Snackbar } from '../../../hooks';
import { EditProfileProps, EditProfileFormValues } from './types';
import { noEmojiValidator } from '../../../utils';
import EditExternalRequesterProfile from './ExternalRequester';
import EditNotificationExternalRequesterProfile from './Notification';
import EditAddressExternalRequesterProfile from './Address';

const EditProfile = ({
  externalRequester,
  color,
  onSubmit,
  setType,
}: EditProfileProps) => {
  const { showV3Snackbar } = useV3Snackbar();

  const initialValues: EditProfileFormValues = {
    externalRequester: {
      name: externalRequester.name,
      email: externalRequester.email,
      phone: externalRequester.phone,
      optionalPhone: externalRequester.optionalPhone,
      optionalEmail: externalRequester.optionalEmail,
      occupation: externalRequester.occupation,
      notification: externalRequester.notification,
    },
    address: {
      street: externalRequester.address.street,
      number: externalRequester.address.number,
      complement: externalRequester.address.complement,
      postalCode: externalRequester.address.postalCode,
      city: externalRequester.address.city,
      state: externalRequester.address.state,
      neighborhood: externalRequester.address.neighborhood,
    },
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        onSubmit(values)
          .then(() => {
            showV3Snackbar(
              'Seus dados de usuário foram alterados.',
              'success',
              'Alteração efetuada com sucesso.'
            );
            setType('show');
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
      validationSchema={Yup.object().shape({
        externalRequester: Yup.object().shape({
          name: Yup.string()
            .required('Campo obrigatório')
            .test(
              'regex',
              'Não utilize emojis (desenhos ou pictogramas).',
              noEmojiValidator
            ),
          email: Yup.string().required('Campo obrigatório'),
          phone: Yup.string()
            .min(11, 'Telefone inválido.')
            .required('Campo obrigatório'),
          notification: Yup.string().required('Escolha uma das opções'),
        }),
        address: Yup.object().shape({
          postalCode: Yup.string().required('Campo obrigatório'),
          street: Yup.string().required('Campo obrigatório'),
          number: Yup.number().required('Campo obrigatório'),
          city: Yup.string().required('Campo obrigatório'),
          state: Yup.string().required('Campo obrigatório'),
          neighborhood: Yup.string().required('Campo obrigatório'),
        }),
      })}
      validateOnChange={false}
      validateOnBlur={false}
      enableReinitialize
    >
      {(formik) => (
        <Form>
          <div className="w-full flex flex-col items-center space-y-4">
            <div className="w-full space-y-2 px-4 sm:px-0">
              <EditExternalRequesterProfile
                externalRequester={externalRequester}
                color={color}
              />
              <EditNotificationExternalRequesterProfile color={color} />
              <EditAddressExternalRequesterProfile color={color} />
            </div>
          </div>
          <div className="space-y-2 mt-5 w-full">
            <div className="sm:hidden sm:justify-end justify-center items-center sm:space-x-4 space-y-2 sm:space-y-0 px-4 pb-4">
              <Button
                color={color}
                type="button"
                label="Cancelar"
                size="sm"
                w="full"
                onClick={() => setType('show')}
                style="outlined"
              />
              <Button
                color={color}
                type="submit"
                label="Salvar"
                size="sm"
                w="full"
                disabled={formik.isSubmitting}
              />
            </div>
            <div className="hidden sm:flex sm:justify-end justify-center items-center sm:space-x-4 space-y-2 sm:space-y-0 pb-4">
              <Button
                color={color}
                type="button"
                label="Cancelar"
                w={56}
                onClick={() => setType('show')}
                style="outlined"
              />
              <Button
                color={color}
                type="submit"
                label="Salvar"
                w={56}
                disabled={formik.isSubmitting}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditProfile;

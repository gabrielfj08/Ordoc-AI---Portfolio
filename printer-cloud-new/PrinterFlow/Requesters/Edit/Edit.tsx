import * as React from 'react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { queryClient } from '../../../queryClient';
import { Button, Input, Typography } from 'printer-ui';
import { useSnackbar } from '../../../hooks';
import { CepPromise } from '../../../services';
import { cpfCnpjMask } from '../../../utils';
import { EditRequesterFormValues, EditRequesterProps } from './types';

const EditRequester = ({ data, onSubmit }: EditRequesterProps) => {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const initialValues: EditRequesterFormValues = {
    name: data.name,
    cpfCnpj: data.cpfCnpj || '',
    phone: data.phone || '',
    email: data.email,
    birthDate: data.birthDate,
    optionalPhone: data.optionalPhone || '',
    optionalEmail: data.optionalEmail || '',
    occupation: data.occupation || '',
    address: {
      street: data.address?.street || '',
      number: data.address?.number ? String(data.address.number) : '',
      complement: data.address?.complement || '',
      postalCode: data.address?.postalCode || '',
      city: data.address?.city || '',
      state: data.address?.state || '',
      neighborhood: data.address?.neighborhood || '',
    },
  };

  return (
    <div className="my-7 px-3 md:px-0">
      <Typography variant="title2" family="robotoMedium" className="mb-7">
        Dados do solicitante
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          onSubmit(values)
            .then(() => {
              showSnackbar(
                'Dados do perfil atualizados com sucesso',
                'success'
              );
              queryClient.invalidateQueries(['requester']);
            })
            .catch((error) => {
              if (error.response.status >= 400 && error.response.status < 500) {
                showSnackbar(error.response.data.message, 'error');
              } else {
                showSnackbar(
                  'Oops, os dados do solicitante não foram alterados. Tente novamente mais tarde',
                  'error'
                );
              }
            });
        }}
        enableReinitialize
      >
        {(formik) => (
          <Form className="space-y-3 md:space-y-7 flex flex-col pr-3">
            <div className="flex flex-col md:flex-row md:space-x-6 md:w-11/12 space-y-3 md:space-y-0">
              <label htmlFor="name" className="space-y-3 md:w-8/12 w-full">
                <Typography variant="footnote1" family="robotoMedium">
                  Nome/Razão Social*:
                </Typography>
                <Input
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  w="full"
                />
              </label>
              <label htmlFor="cpfCnpj" className="space-y-3 md:w-4/12">
                <Typography variant="footnote1" family="robotoMedium">
                  CPF/CNPJ*:
                </Typography>
                <Input
                  id="cpfCnpj"
                  name="cpfCnpj"
                  value={cpfCnpjMask(formik.values.cpfCnpj)}
                  onChange={formik.handleChange}
                  w="full"
                  disabled
                />
              </label>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-6 md:w-11/12 space-y-3 md:space-y-0">
              <label htmlFor="phone" className="space-y-3 md:w-1/2">
                <Typography variant="footnote1" family="robotoMedium">
                  Telefone celular*:
                </Typography>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  w="full"
                />
              </label>
              <label htmlFor="email" className="space-y-3 md:w-1/2">
                <Typography variant="footnote1" family="robotoMedium">
                  E-mail principal:
                </Typography>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  w="full"
                />
              </label>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-6 md:w-11/12 space-y-3 md:space-y-0">
              <label htmlFor="optionalPhone" className="space-y-3 md:w-1/2">
                <Typography variant="footnote1" family="robotoMedium">
                  Telefone fixo:
                </Typography>
                <Input
                  id="optionalPhone"
                  name="optionalPhone"
                  type="phone"
                  value={formik.values.optionalPhone}
                  onChange={formik.handleChange}
                  w="full"
                />
              </label>
              <label htmlFor="optionalEmail" className="space-y-3 md:w-1/2">
                <Typography variant="footnote1" family="robotoMedium">
                  E-mail secundário:
                </Typography>
                <Input
                  id="optionalEmail"
                  name="optionalEmail"
                  value={formik.values.optionalEmail}
                  onChange={formik.handleChange}
                  w="full"
                />
              </label>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-6 md:w-11/12 space-y-3 md:space-y-0">
              <label htmlFor="occupation" className="space-y-3 md:w-1/2">
                <Typography variant="footnote1" family="robotoMedium">
                  Profissão/Atividade:
                </Typography>
                <Input
                  id="occupation"
                  name="occupation"
                  value={formik.values.occupation}
                  onChange={formik.handleChange}
                  w="full"
                />
              </label>
              <label htmlFor="birthDate" className="space-y-3 md:w-1/2">
                <Typography variant="footnote1" family="robotoMedium">
                  Data de nascimento/Abertura:
                </Typography>
                <Input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formik.values.birthDate}
                  onChange={formik.handleChange}
                  w="full"
                />
              </label>
            </div>
            <Typography variant="title2" family="robotoMedium">
              Endereço
            </Typography>
            <div className="flex flex-col md:flex-row md:space-x-6 md:w-11/12 space-y-3 md:space-y-0">
              <label htmlFor="address.street" className="space-y-3  md:w-8/12">
                <Typography variant="footnote1" family="robotoMedium">
                  Endereço:
                </Typography>
                <Input
                  id="address.street"
                  name="address.street"
                  value={formik.values.address.street}
                  onChange={formik.handleChange}
                  w="full"
                />
              </label>
              <label
                htmlFor="address.postalCode"
                className="space-y-3  md:w-4/12"
              >
                <Typography variant="footnote1" family="robotoMedium">
                  CEP:
                </Typography>
                <Input
                  type="cep"
                  id="address.postalCode"
                  name="address.postalCode"
                  value={formik.values.address.postalCode}
                  onChange={formik.handleChange}
                  w="full"
                  onBlur={() =>
                    CepPromise.get(formik.values.address.postalCode).then(
                      (result) => {
                        formik.setFieldValue(
                          'address.street',
                          result.data.street
                        );
                        formik.setFieldValue('address.city', result.data.city);
                        formik.setFieldValue(
                          'address.neighborhood',
                          result.data.neighborhood
                        );
                        formik.setFieldValue(
                          'address.state',
                          result.data.state
                        );
                        formik.setFieldValue('address.number', '');
                        formik.setFieldValue('address.complement', '');
                      }
                    )
                  }
                />
              </label>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-6 md:w-11/12 space-y-3 md:space-y-0">
              <label htmlFor="address.number" className="space-y-3  md:w-4/12">
                <Typography variant="footnote1" family="robotoMedium">
                  Número:
                </Typography>
                <Input
                  id="address.number"
                  name="address.number"
                  value={formik.values.address.number}
                  onChange={formik.handleChange}
                  w="full"
                />
              </label>
              <label
                htmlFor="address.complement"
                className="space-y-3  md:w-4/12"
              >
                <Typography variant="footnote1" family="robotoMedium">
                  Complemento:
                </Typography>
                <Input
                  id="address.complement"
                  name="address.complement"
                  value={formik.values.address.complement}
                  onChange={formik.handleChange}
                  w="full"
                />
              </label>
              <label
                htmlFor="address.neighborhood"
                className="space-y-3  md:w-4/12"
              >
                <Typography variant="footnote1" family="robotoMedium">
                  Bairro:
                </Typography>
                <Input
                  id="address.neighborhood"
                  name="address.neighborhood"
                  value={formik.values.address.neighborhood}
                  onChange={formik.handleChange}
                  w="full"
                />
              </label>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-6 md:w-11/12 space-y-3 md:space-y-0">
              <label htmlFor="address.city" className="space-y-3  md:w-1/2">
                <Typography variant="footnote1" family="robotoMedium">
                  Cidade:
                </Typography>
                <Input
                  id="address.city"
                  name="address.city"
                  value={formik.values.address.city}
                  onChange={formik.handleChange}
                  w="full"
                />
              </label>
              <label htmlFor="address.state" className="space-y-3  md:w-1/2">
                <Typography variant="footnote1" family="robotoMedium">
                  Estado:
                </Typography>
                <Input
                  id="address.state"
                  name="address.state"
                  value={formik.values.address.state}
                  onChange={formik.handleChange}
                  w="full"
                />
              </label>
            </div>
            <div className="flex justify-between md:w-11/12 pt-4 md:pt-0">
              <Button
                label="Cancelar"
                color="error"
                type="button"
                onClick={() =>
                  router.push(
                    `/printer-flow/requesters/${router.query.requestersId}`
                  )
                }
              />
              <Button
                label="Salvar alterações"
                color="info"
                type="submit"
                onClick={() => router.back()}
                disabled={data.status === 'inactive' ? true : false}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditRequester;

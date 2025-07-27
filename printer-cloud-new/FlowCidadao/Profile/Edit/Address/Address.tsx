import * as React from 'react';
import { FormikContextType, useFormikContext } from 'formik';
import { InputV3 as Input, TypographyV3 as Typography } from 'printer-ui';
import { useV3Snackbar } from '../../../../hooks';
import { postalCodeMask } from '../../../../utils';
import { CepPromise } from '../../../../services';
import { EditProfileFormValues } from '../types';
import { EditAddressExternalRequesterProfileProps } from './types';

const EditAddressExternalRequesterProfile = ({
  color,
}: EditAddressExternalRequesterProfileProps) => {
  const [autoCompleteAddress, setAutoCompleteAddress] = React.useState({
    street: true,
    neighborhood: true,
    city: true,
    state: true,
  });

  const { showV3Snackbar } = useV3Snackbar();

  const {
    handleChange,
    setFieldValue,
    values,
    errors,
  }: FormikContextType<EditProfileFormValues> = useFormikContext();

  const handleBlur = () => {
    CepPromise.get(values.address.postalCode)
      .then((result) => {
        setAutoCompleteAddress({
          street: !!result.data.street,
          neighborhood: !!result.data.neighborhood,
          city: !!result.data.city,
          state: !!result.data.state,
        });
        setFieldValue('address.street', result.data.street || '');
        setFieldValue('address.neighborhood', result.data.neighborhood || '');
        setFieldValue('address.city', result.data.city);
        setFieldValue('address.state', result.data.state);
        setFieldValue('address.number', '');
        setFieldValue('address.complement', '');
      })
      .catch(() => {
        setAutoCompleteAddress({
          street: false,
          neighborhood: false,
          city: false,
          state: false,
        });
        showV3Snackbar(
          'Preencha os campos manualmente.',
          'info',
          'Cep não encontrado!'
        );
        setFieldValue('address.street', '');
        setFieldValue('address.city', '');
        setFieldValue('address.neighborhood', '');
        setFieldValue('address.state', '');
        setFieldValue('address.number', '');
        setFieldValue('address.complement', '');
      });
  };

  return (
    <div className="w-full space-y-2">
      <div className="justify-center sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
        <div className="grid w-full space-y-2">
          <Input
            label="Cep*"
            textColor={color}
            borderColor={color}
            focusBorderColor={color}
            styleSize="sm"
            w="full"
            name="address.postalCode"
            type="text"
            placeholder="00.000-000"
            onChange={handleChange}
            value={postalCodeMask(values.address.postalCode)}
            error={
              errors.address?.postalCode && errors.address?.postalCode
                ? true
                : false
            }
            onBlur={handleBlur}
          />
          {errors.address?.postalCode ? (
            <Typography family="jakarta" variant="label" color="error">
              {errors.address?.postalCode}
            </Typography>
          ) : null}
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="Endereço*"
            textColor={color}
            borderColor={color}
            focusBorderColor={color}
            styleSize="sm"
            w="full"
            name="address.street"
            type="text"
            placeholder="Ex.: Rua dos alfeneiros..."
            onChange={handleChange}
            value={values.address.street}
            disabled={autoCompleteAddress.street}
            error={
              errors.address?.street && errors.address?.street ? true : false
            }
          />
          {errors.address?.street ? (
            <Typography family="jakarta" variant="label" color="error">
              {errors.address?.street}
            </Typography>
          ) : null}
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="Número*"
            textColor={color}
            borderColor={color}
            focusBorderColor={color}
            styleSize="sm"
            w="full"
            name="address.number"
            type="number"
            placeholder="Ex.: 123"
            onChange={handleChange}
            value={values.address.number}
            error={
              errors.address?.number && errors.address?.number ? true : false
            }
          />
          {errors.address?.number ? (
            <Typography family="jakarta" variant="label" color="error">
              {errors.address?.number}
            </Typography>
          ) : null}
        </div>
      </div>
      <div className="justify-center sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
        <div className="grid w-full space-y-2">
          <Input
            label="Complemento"
            textColor={color}
            borderColor={color}
            focusBorderColor={color}
            styleSize="sm"
            w="full"
            name="address.complement"
            type="text"
            placeholder="Ex.: Casa 1"
            onChange={handleChange}
            value={values.address.complement}
          />
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="Bairro*"
            textColor={color}
            borderColor={color}
            focusBorderColor={color}
            styleSize="sm"
            w="full"
            name="address.neighborhood"
            type="text"
            placeholder="Nome do seu bairro"
            onChange={handleChange}
            value={values.address.neighborhood}
            disabled={autoCompleteAddress.neighborhood}
            error={
              errors.address?.neighborhood && errors.address?.neighborhood
                ? true
                : false
            }
          />
          {errors.address?.neighborhood ? (
            <Typography family="jakarta" variant="label" color="error">
              {errors.address?.neighborhood}
            </Typography>
          ) : null}
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="Cidade*"
            textColor={color}
            borderColor={color}
            focusBorderColor={color}
            styleSize="sm"
            w="full"
            name="address.city"
            type="text"
            placeholder="Insira o nome de sua cidade"
            onChange={handleChange}
            value={values.address.city}
            disabled={autoCompleteAddress.city}
            error={errors.address?.city && errors.address?.city ? true : false}
          />
          {errors.address?.city ? (
            <Typography family="jakarta" variant="label" color="error">
              {errors.address?.city}
            </Typography>
          ) : null}
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="Estado*"
            textColor={color}
            borderColor={color}
            focusBorderColor={color}
            styleSize="sm"
            w="full"
            name="address.state"
            type="text"
            placeholder="Ex.: PR"
            onChange={handleChange}
            value={values.address.state}
            disabled={autoCompleteAddress.state}
            error={
              errors.address?.state && errors.address?.state ? true : false
            }
          />
          {errors.address?.state ? (
            <Typography family="jakarta" variant="label" color="error">
              {errors.address?.state}
            </Typography>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EditAddressExternalRequesterProfile;

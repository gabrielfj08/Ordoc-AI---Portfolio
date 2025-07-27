import * as React from 'react';
import { FormikContextType, useFormikContext } from 'formik';
import { InputV3 as Input, TypographyV3 as Typography } from 'printer-ui';
import { cpfCnpjMask, phoneNumberMask } from '../../../../utils';
import { EditProfileFormValues } from '../types';
import { EditExternalRequesterProfileProps } from './types';

const EditExternalRequesterProfile = ({
  externalRequester,
  color,
}: EditExternalRequesterProfileProps) => {
  const {
    handleChange,
    values,
    errors,
  }: FormikContextType<EditProfileFormValues> = useFormikContext();

  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-2">
        <Input
          label="Nome ou razão social*"
          textColor={color}
          borderColor={color}
          focusBorderColor={color}
          styleSize="sm"
          w="full"
          name="externalRequester.name"
          type="text"
          placeholder="Insira aqui seu nome ou a razão social de sua empresa."
          onChange={handleChange}
          value={values.externalRequester.name}
          error={
            errors.externalRequester?.name && errors.externalRequester?.name
              ? true
              : false
          }
        />
        {errors.externalRequester?.name && errors.externalRequester?.name ? (
          <Typography family="jakarta" variant="label" color="error">
            {errors.externalRequester?.name}
          </Typography>
        ) : null}
      </div>
      <div className="justify-center sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
        <div className="w-full">
          <Input
            label="CPF ou CNPJ*"
            textColor="gray"
            borderColor={color}
            focusBorderColor={color}
            styleSize="sm"
            maxLength={18}
            w="full"
            name="externalRequester.cpfCnpj"
            type="text"
            onChange={() => {}}
            value={cpfCnpjMask(externalRequester.cpfCnpj)}
            disabled
          />
          <Typography variant="label" family="jakarta" color="gray">
            Atenção, para alterar este campo, solicite na prefeitura.
          </Typography>
        </div>
        <div className="w-full">
          <Input
            label="Nascimento ou data de abertura de sua empresa*"
            textColor="gray"
            borderColor={color}
            focusBorderColor={color}
            styleSize="sm"
            w="full"
            name="externalRequester.birthDate"
            type="date"
            onChange={() => {}}
            value={externalRequester.birthDate}
            disabled
          />
          <Typography variant="label" family="jakarta" color="gray">
            Atenção, para alterar este campo, solicite na prefeitura.
          </Typography>
        </div>
      </div>
      <div className="justify-center sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
        <div className="grid w-full space-y-2">
          <Input
            label="E-mail primário*"
            textColor={color}
            borderColor={color}
            focusBorderColor={color}
            styleSize="sm"
            w="full"
            name="externalRequester.email"
            type="email"
            placeholder="Insira aqui o e-mail preferencial."
            onChange={handleChange}
            value={values.externalRequester.email}
            error={
              errors.externalRequester?.email && errors.externalRequester?.email
                ? true
                : false
            }
          />
          {errors.externalRequester?.email &&
          errors.externalRequester?.email ? (
            <Typography family="jakarta" variant="label" color="error">
              {errors.externalRequester?.email}
            </Typography>
          ) : null}
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="E-mail secundário"
            textColor={color}
            borderColor={color}
            focusBorderColor={color}
            styleSize="sm"
            w="full"
            name="externalRequester.optionalEmail"
            type="email"
            placeholder="Se desejar, insira um segundo e-mail de contato."
            onChange={handleChange}
            value={values.externalRequester.optionalEmail}
          />
        </div>
      </div>
      <div className="justify-center sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
        <div className="grid w-full space-y-2">
          <Input
            label="Celular*"
            textColor={color}
            borderColor={color}
            focusBorderColor={color}
            size={11}
            styleSize="sm"
            w="full"
            name="externalRequester.phone"
            type="text"
            placeholder="(00) 00000-0000"
            onChange={handleChange}
            value={phoneNumberMask(values.externalRequester.phone)}
            error={
              errors.externalRequester?.phone && errors.externalRequester?.phone
                ? true
                : false
            }
          />
          {errors.externalRequester?.phone &&
          errors.externalRequester?.phone ? (
            <Typography family="jakarta" variant="label" color="error">
              {errors.externalRequester?.phone}
            </Typography>
          ) : null}
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="Telefone fixo"
            textColor={color}
            borderColor={color}
            focusBorderColor={color}
            styleSize="sm"
            w="full"
            name="externalRequester.optionalPhone"
            type="text"
            placeholder="(00) 0000-0000"
            onChange={handleChange}
            value={phoneNumberMask(values.externalRequester.optionalPhone)}
          />
        </div>
      </div>
      <div className="justify-center space-y-2">
        <Input
          label="Profissão ou atividade"
          textColor={color}
          borderColor={color}
          focusBorderColor={color}
          styleSize="sm"
          w="full"
          name="externalRequester.occupation"
          type="text"
          placeholder="Insira aqui sua profissão ou o ramo de atuação."
          onChange={handleChange}
          value={values.externalRequester.occupation}
        />
      </div>
    </div>
  );
};

export default EditExternalRequesterProfile;

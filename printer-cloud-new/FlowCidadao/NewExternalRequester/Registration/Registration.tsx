import * as React from 'react';
import { FormikContextType, useFormikContext } from 'formik';
import { cpfCnpjMask, phoneNumberMask } from '../../../utils';
import { InputV3 as Input, Tag, TypographyV3 as Typography } from 'printer-ui';
import { NewExternalRequesterFormValues } from '../types';

const NewRegistrationRequesterForm = ({}) => {
  const {
    handleChange,
    values,
    errors,
  }: FormikContextType<NewExternalRequesterFormValues> = useFormikContext();

  const [maxDate, setMaxDate] = React.useState('');

  React.useEffect(() => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const today = `${year}-${month}-${day}`;
    setMaxDate(today);
  }, [maxDate]);

  return (
    <div className="w-full space-y-2">
      <Input
        label="Nome ou razão social*"
        textColor="cidOrange"
        borderColor="cidOrange"
        focusBorderColor="cidOrange"
        placeholderColor="gray"
        styleSize="sm"
        w="full"
        name="name"
        type="text"
        placeholder="Insira aqui seu nome ou a razão social de sua empresa."
        onChange={handleChange}
        value={values.name}
        error={errors.name && errors.name ? true : false}
      />
      {errors.name && errors.name ? (
        <Typography family="jakarta" variant="label" color="error">
          {errors.name}
        </Typography>
      ) : null}
      <div className="justify-center sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
        <div className="grid w-full space-y-2">
          <Input
            label="CPF ou CNPJ*"
            textColor="cidOrange"
            borderColor="cidOrange"
            focusBorderColor="cidOrange"
            placeholderColor="gray"
            styleSize="sm"
            maxLength={18}
            w="full"
            name="cpfCnpj"
            type="text"
            placeholder="Insira aqui seu CPF ou o CNPJ de sua empresa."
            onChange={handleChange}
            value={cpfCnpjMask(values.cpfCnpj)}
            error={
              values.cpfCnpj
                ? values.cpfCnpj.length < 14
                : errors.cpfCnpj
                ? true
                : false
            }
          />
          {errors.cpfCnpj && errors.cpfCnpj ? (
            <Typography family="jakarta" variant="label" color="error">
              {errors.cpfCnpj}
            </Typography>
          ) : null}
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="Nascimento ou data de abertura de sua empresa*"
            textColor="cidOrange"
            borderColor="cidOrange"
            focusBorderColor="cidOrange"
            placeholderColor="gray"
            styleSize="sm"
            w="full"
            name="birthDate"
            type="date"
            placeholder="Data de Nasc. ou abertura"
            max={maxDate}
            onChange={handleChange}
            value={values.birthDate}
            error={errors.birthDate && errors.birthDate ? true : false}
          />
          {errors.birthDate && errors.birthDate ? (
            <Typography family="jakarta" variant="label" color="error">
              {errors.birthDate}
            </Typography>
          ) : null}
        </div>
      </div>
      <div className="justify-center sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
        <div className="grid w-full space-y-2">
          <Input
            label="E-mail primário*"
            textColor="cidOrange"
            borderColor="cidOrange"
            focusBorderColor="cidOrange"
            placeholderColor="gray"
            styleSize="sm"
            w="full"
            name="email"
            type="email"
            placeholder="Insira aqui o e-mail preferencial."
            onChange={handleChange}
            value={values.email}
            error={errors.email && errors.email ? true : false}
          />
          {errors.email && errors.email ? (
            <Typography family="jakarta" variant="label" color="error">
              {errors.email}
            </Typography>
          ) : null}
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="E-mail secundário"
            textColor="cidOrange"
            borderColor="cidOrange"
            focusBorderColor="cidOrange"
            placeholderColor="gray"
            styleSize="sm"
            w="full"
            name="optionalEmail"
            type="email"
            placeholder="Se desejar, insira um segundo e-mail de contato."
            onChange={handleChange}
            value={values.optionalEmail}
          />
          {errors.optionalEmail && errors.optionalEmail ? (
            <Typography family="jakarta" variant="label" color="error">
              {errors.optionalEmail}
            </Typography>
          ) : null}
        </div>
      </div>
      <div className="justify-center sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
        <div className="grid w-full space-y-2">
          <Input
            label="Celular*"
            textColor="cidOrange"
            borderColor="cidOrange"
            focusBorderColor="cidOrange"
            placeholderColor="gray"
            size={11}
            styleSize="sm"
            w="full"
            name="phone"
            type="text"
            placeholder="(00) 00000-0000"
            onChange={handleChange}
            value={phoneNumberMask(values.phone)}
            error={errors.phone && errors.phone ? true : false}
          />
          {errors.phone && errors.phone ? (
            <Typography family="jakarta" variant="label" color="error">
              {errors.phone}
            </Typography>
          ) : null}
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="Telefone fixo"
            textColor="cidOrange"
            borderColor="cidOrange"
            focusBorderColor="cidOrange"
            placeholderColor="gray"
            styleSize="sm"
            w="full"
            name="optionalPhone"
            type="text"
            placeholder="(00) 0000-0000"
            onChange={handleChange}
            value={phoneNumberMask(values.optionalPhone)}
          />
        </div>
      </div>
      <div className="justify-center space-y-2">
        <Input
          label="Profissão ou atividade"
          textColor="cidOrange"
          borderColor="cidOrange"
          focusBorderColor="cidOrange"
          placeholderColor="gray"
          styleSize="sm"
          w="full"
          name="occupation"
          type="text"
          placeholder="Insira aqui sua profissão ou o ramo de atuação."
          onChange={handleChange}
          value={values.occupation}
        />
        {errors.occupation && errors.occupation ? (
          <Typography family="jakarta" variant="label" color="error">
            {errors.occupation}
          </Typography>
        ) : null}
      </div>
    </div>
  );
};

export default NewRegistrationRequesterForm;

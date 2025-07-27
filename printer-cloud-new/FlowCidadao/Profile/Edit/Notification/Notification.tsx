import * as React from 'react';
import { FormikContextType, useFormikContext, Field } from 'formik';
import { RadioV3 as Radio, TypographyV3 as Typography } from 'printer-ui';
import { EditProfileFormValues } from '../types';
import { EditNotificationExternalRequesterProfileProps } from './types';

const EditNotificationExternalRequesterProfile = ({
  color,
}: EditNotificationExternalRequesterProfileProps) => {
  const {
    handleChange,
    values,
    errors,
  }: FormikContextType<EditProfileFormValues> = useFormikContext();

  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-2">
      <Typography
        family="jakartaBold"
        variant="bodySm"
        align="center"
        color={color}
      >
        Receber notificações por:*
      </Typography>
      <div className="flex space-x-4 pb-2">
        <Field
          as={Radio}
          type="radio"
          id="sms"
          name="externalRequester.notification"
          value="sms"
          onChange={handleChange}
          color={color}
        />
        <label
          id="sms"
          htmlFor="sms"
          className="flex items-center cursor-pointer"
        >
          <Typography family="jakartaBold" variant="bodySm" color={color}>
            SMS
          </Typography>
        </label>
        <Field
          as={Radio}
          type="radio"
          id="email"
          name="externalRequester.notification"
          value="email"
          onChange={handleChange}
          color={color}
        />
        <label
          id="email"
          htmlFor="email"
          className="flex items-center cursor-pointer"
        >
          <Typography family="jakartaBold" variant="bodySm" color={color}>
            E-mail
          </Typography>
        </label>
      </div>
      {errors.externalRequester?.notification ? (
        <Typography family="jakarta" variant="label" color="error">
          {errors.externalRequester?.notification}
        </Typography>
      ) : null}
    </div>
  );
};

export default EditNotificationExternalRequesterProfile;

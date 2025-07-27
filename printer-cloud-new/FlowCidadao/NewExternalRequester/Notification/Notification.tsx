import * as React from 'react';
import { RadioV3 as Radio, TypographyV3 as Typography } from 'printer-ui';
import { useFormikContext, FormikContextType } from 'formik';
import { NewExternalRequesterFormValues } from '../types';

const NotificationRequester = () => {
  const {
    handleChange,
    errors,
  }: FormikContextType<NewExternalRequesterFormValues> = useFormikContext();

  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-2">
      <Typography
        family="jakartaBold"
        variant="bodySm"
        align="center"
        color="darkGray"
      >
        Receber notificações por:
      </Typography>
      <div className="flex space-x-4 pb-2">
        <Radio
          id="sms"
          name="notification"
          value="sms"
          onChange={handleChange}
        />
        <label
          id="sms"
          htmlFor="sms"
          className="flex items-center cursor-pointer"
        >
          <Typography family="jakartaBold" variant="bodySm">
            SMS
          </Typography>
        </label>
        <Radio
          id="email"
          name="notification"
          value="email"
          onChange={handleChange}
        />
        <label
          id="email"
          htmlFor="email"
          className="flex items-center cursor-pointer"
        >
          <Typography family="jakartaBold" variant="bodySm">
            E-mail
          </Typography>
        </label>
      </div>
      {errors.notification ? (
        <Typography family="jakarta" variant="label" color="error">
          {errors.notification}
        </Typography>
      ) : null}
    </div>
  );
};

export default NotificationRequester;

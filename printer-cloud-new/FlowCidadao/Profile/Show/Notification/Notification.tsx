import * as React from 'react';
import { RadioV3 as Radio, TypographyV3 as Typography } from 'printer-ui';
import { ShowNotificationExternalRequesterProfileProps } from './types';

const ShowNotificationExternalRequesterProfile = ({
  externalRequester,
  color,
}: ShowNotificationExternalRequesterProfileProps) => {
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
        <Radio
          id="sms"
          name="notification"
          value="sms"
          onChange={() => {}}
          disabled
          checked={externalRequester.notification === 'sms'}
        />
        <label
          id="sms"
          htmlFor="sms"
          className="flex items-center cursor-pointer"
        >
          <Typography family="jakartaBold" variant="bodySm" color="gray">
            SMS
          </Typography>
        </label>
        <Radio
          id="email"
          name="notification"
          value="email"
          onChange={() => {}}
          disabled
          checked={externalRequester.notification === 'email'}
        />
        <label
          id="email"
          htmlFor="email"
          className="flex items-center cursor-pointer"
        >
          <Typography family="jakartaBold" variant="bodySm" color="gray">
            E-mail
          </Typography>
        </label>
      </div>
    </div>
  );
};

export default ShowNotificationExternalRequesterProfile;

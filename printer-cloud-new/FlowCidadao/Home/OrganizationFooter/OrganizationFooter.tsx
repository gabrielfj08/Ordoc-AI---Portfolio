import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../hooks';
import { phoneNumberMask } from '../../../utils';

const OrganizationFooter = () => {
  const { session, themeColor } = useSession();

  if (!session.organization) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:space-x-2 w-full items-center">
        <Typography variant="headline4" family="jakartaBold" color={themeColor}>
          Dúvidas ou sugestões?
        </Typography>
        <Typography variant="headline4" family="jakartaBold" color={themeColor}>
          Entre em contato conosco!
        </Typography>
      </div>
      <div className="sm:flex h-full items-center space-x-6 space-y-6 sm:space-y-0">
        <div className="flex items-center justify-center space-x-6">
          <div className="h-24 w-24">
            <img src={session.organization.logoUrl} className="h-full" />
          </div>
          <Typography
            variant="headline5"
            family="jakartaBold"
            color={themeColor}
            className="w-44"
          >
            {session.organization.corporateName}
          </Typography>
        </div>
        <div className="flex flex-col space-y-1 items-center sm:items-start">
          <div className="flex items-center space-x-2.5">
            <Icon
              alt="phone"
              name="phoneV3"
              color={themeColor}
              stroke
              w={24}
              h={24}
            />
            <Typography variant="bodyLg" family="jakarta" color={themeColor}>
              {phoneNumberMask(session.organization.contactPhone)}
            </Typography>
          </div>
          <div className="flex items-center space-x-2.5">
            <Icon
              alt="mail"
              name="mailV3"
              color={themeColor}
              stroke
              w={24}
              h={24}
            />
            <Typography variant="bodyLg" family="jakarta" color={themeColor}>
              {session.organization.email}
            </Typography>
          </div>
          <div className="flex items-center space-x-2.5">
            <Icon
              alt="home"
              name="homeV3"
              color={themeColor}
              stroke
              w={24}
              h={24}
            />
            <Typography
              variant="bodyLg"
              family="jakarta"
              color={themeColor}
              align="center"
            >
              {session.organization.address?.street},{' '}
              {session.organization.address?.number} -{' '}
              {session.organization.address?.neighborhood} -{' '}
              {session.organization.address?.city}/
              {session.organization.address?.state}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationFooter;

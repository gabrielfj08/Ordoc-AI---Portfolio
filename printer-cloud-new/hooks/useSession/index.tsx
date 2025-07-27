import * as React from 'react';
import router from 'next/router';
import getConfig from 'next/config';
import { useAuth } from '../';
import { OrganizationService, UserService } from '../../services';
import { DirectoryService } from '../../services/printer-air';
import { SessionContextData, SessionProviderProps, SessionData } from './types';
import { cidColors } from 'printer-ui';

const externalUserId =
  getConfig().publicRuntimeConfig.NEXT_PUBLIC_EXTERNAL_USER_ID;

const SessionContext = React.createContext({} as SessionContextData);

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const { subdomain, token } = useAuth();

  const [session, setSession] = React.useState<SessionData>({} as SessionData);
  const [unauthorized, setUnauthorized] = React.useState<boolean>(false);
  const [themeColor, setThemeColor] = React.useState<cidColors | string>(
    'cidOrange'
  );

  React.useEffect(() => {
    UserService.me(token, subdomain).then((response) => {
      setSession((prevState) => ({
        ...prevState,
        user: response,
      }));
    });
  }, [token]);

  React.useEffect(() => {
    OrganizationService.organization(subdomain).then((response) => {
      setSession((prevState) => ({
        ...prevState,
        organization: response,
      }));
      setThemeColor((prevState) =>
        response.theme ? response.theme.color : prevState
      );
    });
  }, []);

  React.useEffect(() => {
    if (router.query.directoryId) {
      DirectoryService.show(
        token,
        subdomain,
        0, // TODO: DEPRECATE WHEN BACKEND ROUTE REMOVES ORGANIZATION ID FROM URL
        Number(router.query.directoryId)
      )
        .then((response) => {
          setSession((prevState) => ({
            ...prevState,
            directory: response,
          }));
          setUnauthorized(false);
        })
        .catch(() => {
          setUnauthorized(true);
        });
    }
  }, [router.query.directoryId]);

  React.useEffect(() => {
    if (externalUserId) {
      setSession((prevState) => ({
        ...prevState,
        externalUserId: Number(externalUserId),
      }));
    }
  }, [externalUserId]);

  return (
    <SessionContext.Provider
      value={{ session, setSession, unauthorized, themeColor }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return React.useContext(SessionContext);
};

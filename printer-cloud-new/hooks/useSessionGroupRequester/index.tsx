import * as React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { UserService } from '../../services';
import { GroupRequesterService } from '../../services/printer-flow';
import { IndexGroupRequester } from '../../services/printer-flow/types';
import useAuth from '../useAuth';
import {
  SessionGroupRequesterContextData,
  SessionGroupRequesterProviderProps,
} from './types';

const SessionGroupRequesterContext = React.createContext(
  {} as SessionGroupRequesterContextData
);

export const SessionGroupRequesterProvider = ({
  children,
}: SessionGroupRequesterProviderProps) => {
  const { token, subdomain } = useAuth();
  const router = useRouter();

  const [sessionGroupRequester, setSessionGroupRequester] =
    React.useState<IndexGroupRequester>({} as IndexGroupRequester);

  const [unauthorized, setUnauthorized] = React.useState<boolean>(false);

  const { data } = useQuery({
    queryKey: ['hookMe', token, subdomain],
    queryFn: () => UserService.me(token, subdomain),
  });

  const { data: groupRequesterData } = useQuery({
    queryKey: ['userGroupRequesters', token, subdomain],
    queryFn: () =>
      GroupRequesterService.index(token, subdomain, {
        userId: data?.id,
        status: 'active',
      }),
    enabled: !!data?.id,
  });

  React.useEffect(() => {
    if (!!groupRequesterData) {
      if (groupRequesterData.groupRequesters.length > 0) {
        if (!sessionGroupRequester?.id) {
          setSessionGroupRequester(groupRequesterData?.groupRequesters[0]);
        }
      } else {
        setUnauthorized(true);
      }
    }
  }, [groupRequesterData]);

  React.useEffect(() => {
    if (sessionGroupRequester?.id) {
      window.sessionStorage.setItem(
        'sessionGroupRequester',
        JSON.stringify(sessionGroupRequester)
      );
    } else {
      if (window.sessionStorage.getItem('sessionGroupRequester')) {
        setSessionGroupRequester(
          JSON.parse(
            String(window.sessionStorage.getItem('sessionGroupRequester'))
          )
        );
      }
    }
  }, [sessionGroupRequester]);

  const clearSessionGroupRequester = () => {
    window.sessionStorage.removeItem('sessionGroupRequester');
    setSessionGroupRequester({} as IndexGroupRequester);
    router.reload();
  };

  return (
    <SessionGroupRequesterContext.Provider
      value={{
        sessionGroupRequester,
        setSessionGroupRequester,
        clearSessionGroupRequester,
        unauthorized,
      }}
    >
      {children}
    </SessionGroupRequesterContext.Provider>
  );
};

export const useSessionGroupRequester = () => {
  return React.useContext(SessionGroupRequesterContext);
};

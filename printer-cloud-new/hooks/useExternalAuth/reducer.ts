import * as React from 'react';
import router from 'next/router';

type ActionsType = 'charge_session' | 'start_session' | 'clear_session';

interface ReducerActions {
  type: ActionsType;
  externalToken: string | null;
}

const reducer: React.Reducer<
  string | null | undefined,
  Partial<ReducerActions>
> = (externalToken, action) => {
  switch (action.type) {
    case 'charge_session':
      return localStorage.getItem('flow-cidadao-token') || '';

    case 'start_session':
      localStorage.setItem('flow-cidadao-token', action.externalToken || '');
      router.push('/flow-cidadao/start-session');
      return action.externalToken;

    case 'clear_session':
      localStorage.removeItem('flow-cidadao-token');
      router.push('/flow-cidadao/login');
      return null;

    default:
      throw Error(`Unknow action: ${action.type}`);
  }
};

export default reducer;

import * as React from 'react';
import { useCookies } from 'react-cookie';
import Cookies from './Cookies';

const CookiesContainer = () => {
  const [cookie, setCookie] = useCookies(['cookiesConsent']);

  const handleCookie = () => {
    const data = new Date();
    const expires = new Date();
    expires.setDate(data.getDate() + 365);
    setCookie('cookiesConsent', true, { expires: expires });
  };

  return (
    <>{!cookie.cookiesConsent ? <Cookies onSubmit={handleCookie} /> : null}</>
  );
};
export default CookiesContainer;

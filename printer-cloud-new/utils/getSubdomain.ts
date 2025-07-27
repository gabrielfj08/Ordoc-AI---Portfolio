export const getSubdomain = (): string => {
  const hostname = window.location.hostname;

  const subdomain =
    hostname.split('.')[0] === 'staging'
      ? hostname.split('.')[1]
      : hostname.split('.')[0];

  return subdomain;
};

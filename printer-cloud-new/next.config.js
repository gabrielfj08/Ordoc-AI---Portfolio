/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    return config;
  },
  reactStrictMode: false,
  publicRuntimeConfig: {
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_FLOW_URL: process.env.NEXT_PUBLIC_FLOW_URL,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY_INVISIBLE:
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_INVISIBLE,
    NEXT_PUBLIC_EXTERNAL_USER_ID: process.env.NEXT_PUBLIC_EXTERNAL_USER_ID,
  },
  serverRuntimeConfig: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    RECAPTCHA_SECRET_KEY_INVISIBLE: process.env.RECAPTCHA_SECRET_KEY_INVISIBLE,
  },
};

module.exports = nextConfig;

New Printer Cloud Project:

## Pre-requisites

- Node v16.14.0

## Getting Started

Install the dependencies:

```bash
$ npm install
```

Configure hosts:

As admin, go to the file /etc/hosts and below '127.0.0.1 localhost' add the line:

```
127.0.0.1 printerdobrasil.localhost localhost

```

Setup the environment variables:

Create a `.env.local` file based on this template:

```
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/
NEXT_PUBLIC_FLOW_URL=https://staging.flow.printercloud.com.br/
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LdD_VohAAAAAJRUiVnCDCAPVcegKuqYEkTxZCcR
NEXT_PUBLIC_RECAPTCHA_SITE_KEY_INVISIBLE=6LfX_iMnAAAAAAo8YIAixENI8Zz28JDrCv0qUttr
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=fake-aws-access-key-id
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=fake-aws-secret-access-key
RECAPTCHA_SECRET_KEY=fake-recaptcha-secret-key
RECAPTCHA_SECRET_KEY_INVISIBLE=fake-recaptcha-secret-key-invisible
```

Run the development server:

```bash
$ npm run dev
```

Open [http://printerdobrasil.localhost:8080](http://printerdobrasil.localhost:8080) with your browser to see the result.

Run tests:

```bash
$ npm run test
```

## Documentations:

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [JavaScript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

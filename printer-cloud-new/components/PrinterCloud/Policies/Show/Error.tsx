import * as React from 'react';
import router from 'next/router';
import { ButtonRounded, Icon, Typography } from 'printer-ui';
import Layout, { Header } from '../../../Layout';

const ErrorPage = () => {
  return (
    <>
      <Layout>
        <Header className="pr-5 sm:px-5 py-5 justify-between">
          <div className="flex space-x-5 px-2 w-full items-center h-full">
            <div className="hidden w-0 sm:block sm:w-fit">
              <ButtonRounded
                onClick={() => {
                  router.push(`/printer-cloud/policies`);
                }}
              >
                <Icon
                  name="return"
                  alt="voltar"
                  color="gray"
                  w={30}
                  h={30}
                  fill
                  stroke
                />
              </ButtonRounded>
            </div>
            <Icon
              alt="done"
              name="done"
              w={40}
              h={40}
              color="black"
              stroke
            ></Icon>{' '}
            <Typography
              family="robotoBold"
              variant="title3"
              className="sm:w-full w-52 sm:truncate-none truncate"
            >
              Visualizar permissão
            </Typography>
          </div>
        </Header>
        <main className="pt-40 flex items-center justify-center space-x-2 px-6">
          <Icon name="alert" alt="erro" color="error" stroke />
          <Typography variant="footnote1" color="gray">
            Erro! Não foi possível carregar a página de visualização de
            permissão, tente novamente mais tarde.
          </Typography>
        </main>
      </Layout>
    </>
  );
};

export default ErrorPage;

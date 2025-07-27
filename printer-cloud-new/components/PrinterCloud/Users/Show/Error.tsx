import * as React from 'react';
import router from 'next/router';
import { ButtonRounded, Icon, Typography } from 'printer-ui';
import { Header } from '../../../Layout';

const ErrorShowUserPage = () => {
  return (
    <>
      <Header className="pr-5 sm:px-5 py-5 justify-between">
        <div className="flex space-x-5 px-2 items-center h-full">
          <div className="invisible w-0 sm:visible sm:w-fit">
            <ButtonRounded
              onClick={() => {
                router.push(`/printer-cloud/users`);
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
        </div>
      </Header>
      <main className="pt-40 flex items-center justify-center space-x-2 px-6">
        <Icon name="alert" alt="erro" color="error" stroke />
        <Typography variant="footnote1" color="gray">
          Erro! Não foi possível carregar a página de visualização do usuário,
          tente novamente mais tarde.
        </Typography>
      </main>
    </>
  );
};

export default ErrorShowUserPage;

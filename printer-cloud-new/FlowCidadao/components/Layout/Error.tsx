import * as React from 'react';
import {
  Icon,
  SidebarV3 as Sidebar,
  TypographyV3 as Typography,
} from 'printer-ui';

const ErrorLayout = () => {
  const sidebarButtons = [
    { id: 1, title: 'processos', icon: 'proceduresV3', onClick: () => {} },
    { id: 2, title: 'tarefas', icon: 'tasksV3', onClick: () => {} },
    { id: 3, title: 'assinaturas', icon: 'signaturesV3', onClick: () => {} },
    { id: 4, title: 'compartilhados', icon: 'sharedV3', onClick: () => {} },
  ];

  return (
    <>
      <div className="relative min-h-screen flex">
        <div className="flex sm:hidden pt-8">
          <div className="w-14 h-14 rounded-full items-center justify-center bg-white shadow-default sm:hidden flex z-10 absolute ml-6">
            <Icon
              alt="sandwich"
              name="sandwich"
              w={20}
              h={20}
              fill
              color="cidGrayLight"
            />
          </div>
        </div>
        <Sidebar
          bgColor="cidGrayLight"
          userName=""
          logo="../../assets/flow-cidadao.svg"
          src="../../assets/powered-by-printer.png"
          className="z-20 sm:flex hidden"
          avatar={
            <div className="flex items-center space-x-2 justify-center">
              <Icon alt="alert" name="alert" color="error" stroke />
              <Typography variant="bodyMd" color="gray" align="center">
                Erro!
              </Typography>
            </div>
          }
        >
          <Sidebar.Buttons
            initialValue={0}
            color="cidGrayLight"
            buttons={sidebarButtons}
          />
        </Sidebar>
        <div className="flex-1">
          <div className="sm:h-52 h-32 flex flex-1">
            <div className="w-full justify-center align-center sm:flex hidden bg-cidGrayLight">
              <div className="flex items-center space-x-2 justify-center">
                <Icon alt="alert" name="alert" color="error" stroke />
                <Typography variant="bodyMd" color="gray" align="center">
                  Erro! Não foi possível carregar a imagem da instituição.
                </Typography>
              </div>
            </div>
          </div>
          <div className="sm:h-16 h-12 flex items-center sm:pl-20 pl-4">
            <div className="flex items-center justify-center">
              <Typography variant="headline3" family="jakartaBold" color="gray">
                Bem vindo(a),
              </Typography>
              <div className="sm:w-96 w-60 h-8 flex items-center space-x-2 justify-center">
                <Icon alt="alert" name="alert" color="error" stroke />
                <Typography variant="bodyMd" color="gray" align="center">
                  Erro! Não foi possível carregar as informações.
                </Typography>
              </div>
            </div>
          </div>
          <div className="h-16 flex items-center border-cidGrayLight border-b-2 sm:ml-20 sm:mr-12 mx-7">
            <Typography
              variant="headline5"
              family="jakarta"
              color="cidGrayLight"
              align="start"
            >
              Com o Flow Cidadão você pode criar solicitações e acompanhar
              processos.
            </Typography>
          </div>
          <div className="flex items-center space-x-2 justify-center pt-10 w-full px-16">
            <Icon alt="alert" name="alert" color="error" stroke />
            <Typography variant="bodyMd" color="gray" align="center">
              Erro! Não foi possível carregar as informações. Tente novamente
              mais tarde.
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorLayout;

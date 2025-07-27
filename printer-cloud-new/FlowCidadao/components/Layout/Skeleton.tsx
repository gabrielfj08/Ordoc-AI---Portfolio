import * as React from 'react';
import {
  Icon,
  SidebarV3 as Sidebar,
  Skeleton,
  TypographyV3 as Typography,
} from 'printer-ui';

const SkeletonLayout = () => {
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
          avatar={<Skeleton w={16} h={16} />}
        >
          <Sidebar.Buttons
            buttons={sidebarButtons}
            color="cidGrayLight"
            initialValue={0}
          />
        </Sidebar>
        <div className="flex-1">
          <div className="sm:h-52 h-32 flex flex-1">
            <div className="absolute">
              <Skeleton
                w={28}
                h={28}
                className="z-10 ml-36 mt-2 sm:hidden flex"
              />
              <Skeleton
                w={80}
                h={24}
                className="ml-16 z-10 mt-14 sm:flex hidden"
              />
            </div>
            <div className="w-full justify-end align-left bg-bottom min-w-full sm:flex hidden">
              <Skeleton
                w="full"
                h="auto"
                className="justify-end align-left bg-bottom min-w-full sm:flex hidden"
              />
            </div>
          </div>
          <div className="sm:h-16 h-12 flex items-center sm:pl-20 pl-7">
            <div className="flex">
              <Typography
                variant="headline3"
                family="jakartaBold"
                color="gray"
                align="end"
              >
                Bem vindo(a),
              </Typography>
              <Skeleton className="ml-4" w={44} h={8} />
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
        </div>
      </div>
    </>
  );
};

export default SkeletonLayout;

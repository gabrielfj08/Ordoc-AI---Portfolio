import * as React from 'react';
import router from 'next/router';
import { Icon, SidebarV3 as Sidebar } from 'printer-ui';
import AppBarCidadaoMain from './Appbar/AppbarMain';
import { AuthExternalProvider, useDrawer } from '../../../hooks';
import { LayoutProps } from './types';
import AppBarCidadaoInternal from './Appbar/AppbarInternal';
import AvatarPopover from './Popover';

const Layout = ({
  children,
  theme,
  userName,
  backgroundImg,
  imageUrl,
  imageLogo,
  internal,
  title,
  icon,
  subtitle,
  onClick,
}: LayoutProps) => {
  const { openDrawer } = useDrawer();

  const activeSession: () => number = () => {
    switch (router.pathname.split('/')[2]) {
      case 'procedures':
        return 1;
      case 'tasks':
        return 2;
      case 'signatures':
        return 3;
      case 'shared':
        return 4;
      default:
        return 0;
    }
  };

  const sidebarButtons = [
    {
      id: 1,
      title: 'processos',
      icon: 'proceduresV3',
      onClick: () => {
        router.push('/flow-cidadao/procedures');
      },
    },
    {
      id: 2,
      title: 'tarefas',
      icon: 'tasksV3',
      onClick: () => {
        router.push('/flow-cidadao/tasks');
      },
    },
    {
      id: 3,
      title: 'assinaturas',
      icon: 'signaturesV3',
      onClick: () => {
        router.push('/flow-cidadao/signatures');
      },
    },
    {
      id: 4,
      title: 'compartilhados',
      icon: 'sharedV3',
      onClick: () => {
        router.push('/flow-cidadao/shared');
      },
    },
  ];

  const OpenPopover = () => {
    return <AvatarPopover userName={userName} color={theme} />;
  };

  const handleMobileClick = () => {
    openDrawer(
      <AuthExternalProvider>
        <div className="h-full sm:hidden">
          <Sidebar
            bgColor={theme}
            userName={userName.split(' ')[0]}
            logo="/assets/flow-cidadao.svg"
            src="/assets/powered-by-printer.png"
            className="z-20"
            avatar={OpenPopover()}
            onHomeClick={() => router.push('/flow-cidadao/home')}
          >
            <Sidebar.Buttons
              buttons={sidebarButtons}
              initialValue={activeSession()}
              color={theme}
            />
          </Sidebar>
        </div>
      </AuthExternalProvider>,
      'left'
    );
  };

  return (
    <div className="sm:flex sm:flex-col sm:max-h-screen sm:min-h-[710px] bg-[url(/assets/login-bg-flow-cidadao.png)] bg-right-bottom bg-no-repeat">
      <Sidebar
        bgColor={theme}
        userName={userName.split(' ')[0]}
        logo="/assets/flow-cidadao.svg"
        src="/assets/powered-by-printer.png"
        className="z-20 sm:flex absolute h-full hidden"
        avatar={OpenPopover()}
        onHomeClick={() => router.push('/flow-cidadao/home')}
      >
        <Sidebar.Buttons
          buttons={sidebarButtons}
          initialValue={activeSession()}
          color={theme}
        />
      </Sidebar>
      <div className="sm:ml-24 overflow-hidden overflow-y-auto">
        {internal ? (
          <div>
            <div className="flex sm:hidden">
              <div
                className="w-14 h-14 rounded-full items-center justify-center shadow-default sm:hidden flex z-10 absolute ml-6 mt-5 bg-white"
                onClick={handleMobileClick}
              >
                <Icon
                  alt="sandwich"
                  name="sandwich"
                  color={theme}
                  fill
                  w={20}
                  h={20}
                />
              </div>
            </div>
            <AppBarCidadaoInternal
              color={theme}
              title={title}
              subtitle={subtitle}
              icon={icon}
              onClick={onClick}
            >
              {children}
            </AppBarCidadaoInternal>
          </div>
        ) : (
          <div>
            <div className="flex sm:hidden">
              <div
                className="w-14 h-14 rounded-full items-center justify-center shadow-default sm:hidden flex z-10 absolute ml-6 mt-9 bg-white"
                onClick={handleMobileClick}
              >
                <Icon
                  alt="sandwich"
                  name="sandwich"
                  color={theme}
                  fill
                  w={20}
                  h={20}
                />
              </div>
            </div>
            <AppBarCidadaoMain
              color={theme}
              userName={userName.split(' ')[0]}
              backgroundImg={backgroundImg}
              imageUrl={imageUrl}
              imageLogo={imageLogo}
              subtitle={subtitle}
            >
              {children}
            </AppBarCidadaoMain>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;

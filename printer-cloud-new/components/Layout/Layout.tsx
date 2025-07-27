import * as React from 'react';
import router from 'next/router';
import Link from 'next/link';
import { useDrawer } from '../../hooks';
import { AppBar, Sidebar, ButtonRounded, Icon } from 'printer-ui';
import { LayoutProps } from './types';
import UserButtonContainer from '../UserButton';

export interface SidebarButtonsProps {
  onClick: () => void;
}

const Layout = ({ className, children }: LayoutProps) => {
  const { openDrawer, closeDrawer } = useDrawer();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleClick = () => {
    setSidebarOpen((current) => !current);
  };

  const SidebarButtons = ({ onClick }: SidebarButtonsProps) => {
    return (
      <div className="align-left pt-2" onClick={closeDrawer}>
        <Link href="/printer-cloud/home">
          <Sidebar.Button
            icon="home"
            title="Home"
            color="blue"
            open={sidebarOpen}
            onClick={onClick}
            selected={router.pathname.match('/home') ? true : false}
            fill
            stroke
          />
        </Link>
        <Link href="/printer-cloud/organizations">
          <Sidebar.Button
            icon="institution"
            title="Instituição"
            color="blue"
            open={sidebarOpen}
            onClick={onClick}
            selected={router.pathname.match('/organizations') ? true : false}
            stroke
          />
        </Link>
        <Link href="/printer-cloud/user-groups">
          <Sidebar.Button
            icon="group"
            title="Grupos"
            color="blue"
            open={sidebarOpen}
            selected={router.pathname.match('/user-groups') ? true : false}
            onClick={onClick}
            stroke
          />
        </Link>
        <Link href="/printer-cloud/users">
          <Sidebar.Button
            icon="user"
            title="Usuários"
            color="blue"
            open={sidebarOpen}
            selected={router.pathname.match('/users') ? true : false}
            onClick={onClick}
            stroke
          />
        </Link>
        <Link href="/printer-cloud/policies">
          <Sidebar.Button
            icon="done"
            title="Permissões"
            color="blue"
            open={sidebarOpen}
            selected={router.pathname.match('/policies') ? true : false}
            onClick={onClick}
            stroke
          />
        </Link>
      </div>
    );
  };

  const handleMobileClick = () => {
    openDrawer(<SidebarButtons onClick={closeDrawer} />, 'left');
  };

  return (
    <div className="w-full h-full m-0 p-0 overflow-x-auto">
      <AppBar
        className="items-center justify-end flex w-full"
        image="https://printer-cloud-images.s3.sa-east-1.amazonaws.com/logo-printer-cloud.png"
        color="blue"
      >
        <div className="pl-4 sm:pl-0">
          <ButtonRounded
            className="visible sm:w-0 sm:invisible"
            onClick={handleMobileClick}
          >
            <Icon
              alt="sandwich"
              name="sandwich"
              w={22}
              h={22}
              fill
              color="gray"
            />
          </ButtonRounded>
        </div>
        <div className="flex w-full pr-4 sm:mr-10">
          <div className="h-16 flex w-full justify-end ">
            <UserButtonContainer currentOrganizationId={0} />
          </div>
        </div>
      </AppBar>
      <main className="flex w-full">
        <Sidebar className="invisible w-0 sm:visible sm:w-fit">
          <SidebarButtons onClick={() => {}} />
        </Sidebar>
        <div className="sm:pt-8 sm:ml-4 sm:w-12 sm:h-28 sm:border-b sm:border-lightGray w-0">
          <ButtonRounded className="sm:visible invisible" onClick={handleClick}>
            <Icon
              alt="sandwich"
              name="sandwich"
              w={22}
              h={22}
              fill
              color="gray"
            />
          </ButtonRounded>
        </div>
        <div className={`${className} w-full h-fit mb-6`}>{children}</div>
      </main>
    </div>
  );
};

export default Layout;

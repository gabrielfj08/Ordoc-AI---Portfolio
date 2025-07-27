import * as React from 'react';
import router from 'next/router';
import Link from 'next/link';
import { ButtonRounded, Icon, Sidebar } from 'printer-ui';
import { useSession } from '../../../../hooks';
import { AirSidebarProps } from '../types';

const AirSidebar = ({ buttonClick }: AirSidebarProps) => {
  const { session } = useSession();
  const [sidebarOpened, setSidebarOpen] = React.useState<boolean>(true);

  if (!session.organization) return null;

  const sections = [
    {
      label: 'Meu Air',
      icon: 'air',
      path: `/printer-air/my-air/organizations/${session.organization.id}/directories/${session.organization.rootDirectory.id}`,
      fill: false,
      stroke: true,
    },
    {
      label: 'Compartilhados',
      icon: 'shared',
      path: `/printer-air/shared/organizations/${session.organization.id}/sharedDirectories?root=true`,
      fill: true,
      stroke: false,
    },
    {
      label: 'Recentes',
      icon: 'clock',
      path: `/printer-air/recents/organizations/${session.organization.id}`,
      fill: false,
      stroke: true,
    },
    {
      label: 'Lixeira',
      icon: 'trashV2',
      path: `/printer-air/recycle-bin/organizations/${session.organization.id}`,
      fill: true,
      stroke: true,
    },
  ];

  const handleClick = () => {
    setSidebarOpen((current) => !current);
  };

  return (
    <div className="flex">
      <Sidebar className="pt-2">
        {sections.map((section) => (
          <Link href={`${section.path}`} key={section.label}>
            <Sidebar.Button
              icon={section.icon}
              title={section.label}
              color="red"
              open={sidebarOpened}
              selected={
                router.pathname.split('/')[2] === section.path.split('/')[2]
              }
              onClick={buttonClick}
              stroke={section.stroke}
              fill={section.fill}
            />
          </Link>
        ))}
      </Sidebar>
      <div className="hidden sm:block">
        <div className="sm:pt-8 sm:ml-4 sm:w-12 sm:h-28 sm:border-b sm:border-lightGray w-0">
          <ButtonRounded onClick={handleClick}>
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
      </div>
    </div>
  );
};

export default AirSidebar;

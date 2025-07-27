import * as React from 'react';
import router from 'next/router';
import Link from 'next/link';
import { ButtonRounded, Icon, Sidebar } from 'printer-ui';
import { useSession } from '../../../../hooks';
import { FlowSidebarProps } from './types';

const FlowSidebar = ({ buttonClick }: FlowSidebarProps) => {
  const [sidebarOpened, setSidebarOpen] = React.useState<boolean>(true);
  const { session } = useSession();

  if (!session.organization) return null;

  const sections = [
    {
      label: 'Processos',
      icon: 'proceduresV3',
      path: `/printer-flow/procedures`,
      fill: false,
      stroke: true,
    },
    {
      label: 'Tarefas',
      icon: 'tasksV3',
      path: `/printer-flow/tasks`,
      fill: false,
      stroke: true,
    },
    {
      label: 'Assinaturas',
      icon: 'signaturesV3',
      path: `/printer-flow/signatures`,
      fill: false,
      stroke: true,
    },
    {
      label: 'Consulta geral',
      icon: 'search',
      path: `/printer-flow/search`,
      fill: false,
      stroke: true,
    },
    {
      label: 'Tipos de processo',
      icon: 'procedureTemplateV3',
      path: `/printer-flow/procedure-templates`,
      fill: true,
      stroke: true,
    },
    {
      label: 'Tipos de tarefa',
      icon: 'taskTemplateV3',
      path: `/printer-flow/task-templates`,
      fill: false,
      stroke: true,
    },
    {
      label: 'Solicitantes',
      icon: 'requesterV3',
      path: `/printer-flow/requesters`,
      fill: true,
      stroke: false,
    },
    {
      label: 'Grupos',
      icon: 'groupRequesterV3',
      path: `/printer-flow/groups`,
      fill: true,
      stroke: false,
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
              color="yellow"
              open={sidebarOpened}
              selected={
                router.pathname.split('/')[2] === section.path.split('/')[2] ||
                router.pathname.split('/')[4] === section.path.split('/')[2]
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

export default FlowSidebar;

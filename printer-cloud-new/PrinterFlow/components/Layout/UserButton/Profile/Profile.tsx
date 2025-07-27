import * as React from 'react';
import router from 'next/router';
import { Button, Typography, ButtonGroup, Avatar, Icon } from 'printer-ui';
import { GroupRequesterService } from '../../../../../services/printer-flow';
import { useAuth, useDrawer, useModal, useSession } from '../../../../../hooks';
import { FlowProfileProps } from './types';
import SelectGroup from './SelectGroupRequesters';

const FlowProfile = ({
  user,
  apps,
  setCurrentGroup,
  currentGroup,
}: FlowProfileProps) => {
  const { token, subdomain } = useAuth();
  const { closeDrawer } = useDrawer();
  const { clearSession } = useAuth();
  const { closeModal } = useModal();
  const { session } = useSession();

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  const logout = () => {
    clearSession();
    closeModal();
  };

  const [initialGroup, setInitialGroup] = React.useState({});

  React.useEffect(() => {
    GroupRequesterService.index(token, subdomain, {
      userId: user.id,
      status: 'active',
    }).then((res) =>
      setInitialGroup(
        res.meta.total === 0
          ? { id: 0, value: '' }
          : {
              id: res.groupRequesters[0].id,
              value: res.groupRequesters[0].name,
            }
      )
    );
  }, [user.id]);

  return (
    <div className="py-5 px-4 z-50">
      <div className="mt-20 sm:mt-0">
        <div className="items-center justify-center flex pb-4">
          <Typography
            variant="footnote1"
            family="robotoBold"
            className="truncate"
          >
            Selecione o grupo:
          </Typography>
        </div>
        <div className="pb-4">
          <SelectGroup
            userId={user.id}
            currentGroup={currentGroup}
            setCurrentGroup={setCurrentGroup}
          />
        </div>
      </div>
      <div className="items-center justify-center flex">
        <Avatar
          size="xl"
          color={
            router.pathname.match('/printer-air')
              ? 'red'
              : router.pathname.match('/printer-flow')
              ? 'yellow'
              : 'blue'
          }
          placeholder={`${user.name}`.charAt(0)}
          src={user.avatarUrl}
        />
      </div>
      <div className="flex w-56 justify-center items-center pt-4">
        <Typography
          variant="footnote1"
          family="robotoBold"
          align="center"
          className="truncate"
        >
          {user.name}
        </Typography>
      </div>
      <div className="pt-2 pb-2 items-center flex justify-center">
        <Button
          label="Editar perfil"
          outlined
          color="gray"
          size="md"
          className="hover:bg-lighterGray px-9 py-5"
          onClick={() => router.push('/printer-cloud/profile/edit')}
        />
      </div>
      <div className="sm:h-20 h-fit flex flex-col items-center mx-6 space-y-5 sm:flex-row sm:space-y-0 sm:space-x-2 sm:justify-center mt-3 mb-5">
        {apps
          .filter(
            (filterApps) =>
              filterApps.service !== 'printer_optical' &&
              filterApps.service !== 'printer_reports'
          )
          .map((app) => (
            <div
              key={app.service}
              className={`h-16 sm:h-14 sm:w-14 ${
                app.service === 'printer_air'
                  ? 'bg-red'
                  : app.service === 'printer_flow'
                  ? 'bg-yellow'
                  : 'bg-blue'
              } w-full rounded-xl flex items-center justify-center space-x-3 cursor-pointer
          ${
            (app.service === 'printer_cloud' &&
              router.pathname.match(`${'/printer-cloud'}`)) ||
            (app.service === 'printer_air' &&
              router.pathname.match(`${'/printer-air'}`)) ||
            (app.service === 'printer_flow' &&
              router.pathname.match(`${'/printer-flow'}`))
              ? 'hidden'
              : 'block'
          }`}
              onClick={() => {
                closeDrawer();
                router.push(
                  `${
                    app.service === 'printer_air'
                      ? `/printer-air/my-air/organizations/${session.organization.id}/directories/${session.organization.rootDirectory.id}`
                      : app.service === 'printer_flow'
                      ? `/printer-flow/procedures`
                      : `/printer-cloud/home`
                  }`
                );
              }}
            >
              <Icon
                alt={app.service}
                name={
                  app.service === 'printer_air'
                    ? 'air'
                    : app.service === 'printer_flow'
                    ? 'flow'
                    : 'cloud'
                }
                w={50}
                h={50}
                color="white"
                stroke
              />
              <Typography
                variant="footnote1"
                family="robotoBold"
                color="white"
                className="sm:hidden"
              >
                {app.name}
              </Typography>
            </div>
          ))}
      </div>
      <div className="flex">
        <ButtonGroup.Button
          component={() => (
            <Button
              className="border-none mr-3 pl-14 -ml-9"
              color="gray"
              label="FAQ"
              outlined
              onClick={() => openInNewTab('/faq')}
            >
              <Button.Icon
                name="tutorials"
                alt="tutorials"
                color="gray"
                fill
                w={26}
                h={26}
              />
            </Button>
          )}
        />
        <ButtonGroup.Button
          component={() => (
            <Button
              className="border-none"
              color="gray"
              label="Sobre"
              outlined
              onClick={() => router.push('/printer-cloud/about')}
            >
              <Button.Icon
                name="info"
                alt="info"
                color="gray"
                stroke
                w={25}
                h={25}
              />
            </Button>
          )}
        />
      </div>
      <div className="flex  pt-4 items-center justify-center">
        <Button
          color="error"
          size="sm"
          label="Sair do sistema"
          className="hover:bg-red py-5"
          onClick={logout}
        >
          <Button.Icon
            name="exit"
            alt="exit"
            color="white"
            fill
            w={23}
            h={23}
          />
        </Button>
      </div>
    </div>
  );
};

export default FlowProfile;

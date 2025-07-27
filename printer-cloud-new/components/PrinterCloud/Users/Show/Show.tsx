import * as React from 'react';
import Head from 'next/head';
import router from 'next/router';
import { Tab } from '@headlessui/react';
import { Typography, Icon, ButtonRounded, Skeleton, Button } from 'printer-ui';
import { useAuth, useSnackbar } from '../../../../hooks';
import { phoneMask } from '../../../../utils';
import { UserService } from '../../../../services';
import { ShowUserProps } from './types';
import ShowUserSkeleton from './ShowSkeleton';
import { Header } from '../../../Layout';
import UsersTab from '../../../Tab/UsersTab/UsersTab';
import UsersPoliciesTab from '../../../Tab/UsersTab/UsersPoliciesTab';
import UsersUserGroupsTab from '../../../Tab/UsersTab/UsersUserGroupsTab';

const ShowUser = ({ user, userGroup }: ShowUserProps) => {
  const { showSnackbar } = useSnackbar();
  const { subdomain, token } = useAuth();
  const [disableSmsAndEmail, setDisableSmsAndEmail] = React.useState(false);

  const handleSendSMSNotificationClick = () => {
    setDisableSmsAndEmail(true);
    UserService.sendRandomPassword(token, subdomain, user.id, {
      notificationType: 'sms',
    })
      .then(() => {
        setDisableSmsAndEmail(false);
        showSnackbar('Senha enviada ao usuário via SMS.', 'success');
      })
      .catch((error) => {
        setDisableSmsAndEmail(false);
        showSnackbar(error.response.data.message, 'error');
      });
  };

  const handleSendEmailNotificationClick = () => {
    setDisableSmsAndEmail(true);
    UserService.sendRandomPassword(token, subdomain, user.id, {
      notificationType: 'email',
    })
      .then(() => {
        setDisableSmsAndEmail(false);
        showSnackbar('Senha enviada ao usuário via email.', 'success');
      })
      .catch((error) => {
        setDisableSmsAndEmail(false);
        showSnackbar(error.response.data.message, 'error');
      });
  };

  return (
    <>
      <Head>
        <title>Printer Cloud | Visualizar usuário</title>
      </Head>
      <Header className="pr-5 sm:px-5 py-5 justify-between truncate">
        <div className="flex space-x-5 px-2 truncate items-center h-full">
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
          {user.id ? (
            <Typography
              variant="title3"
              family="robotoBold"
              className="truncate"
            >
              {user.name}
            </Typography>
          ) : (
            <div className="mt-2">
              <Skeleton h={8} w={112} />
            </div>
          )}
        </div>
      </Header>
      <div className="w-full h-full px-4 flex-col lg:flex-row flex">
        <div className="sm:w-4/12 lg:w-6/12 w-full h-fit my-5">
          {user.id ? (
            <div>
              <div className="flex items-center">
                <Icon name="user" alt="user" w={36} h={36} stroke />
                <Typography variant="title2" family="robotoMedium">
                  Dados do usuário
                </Typography>
              </div>
              <div className="space-y-3 mt-6">
                <div className="flex h-7 items-center">
                  <Typography
                    className="w-32"
                    variant="footnote1"
                    family="robotoMedium"
                  >
                    Nome
                  </Typography>
                  <Typography
                    className="w-full text-end sm:text-start"
                    variant="footnote1"
                  >
                    {user.name}
                  </Typography>
                </div>
                <div className="flex h-7 items-center">
                  <Typography
                    className="w-32"
                    variant="footnote1"
                    family="robotoMedium"
                  >
                    Username
                  </Typography>
                  <Typography
                    className="w-full text-end sm:text-start"
                    variant="footnote1"
                  >
                    {user.username}
                  </Typography>
                </div>
                <div className="flex items-center h-7">
                  <Typography
                    className="w-32"
                    variant="footnote1"
                    family="robotoMedium"
                  >
                    Status
                  </Typography>
                  <div className="flex w-full items-center justify-end sm:justify-start">
                    <div className="flex items-center justify-end space-x-1">
                      <Icon
                        name={
                          user.status === 'active'
                            ? 'userTrue'
                            : 'inactive'
                            ? 'userFalse'
                            : 'userFalse'
                        }
                        alt="status-icon"
                        h={28}
                        w={28}
                        fill
                      />
                      <Typography className="w-full" variant="footnote1">
                        {user.status === 'active'
                          ? 'Ativo'
                          : 'inactive'
                          ? 'Inativo'
                          : 'Bloqueado'}
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="flex h-7 items-center">
                  <Typography
                    className="w-32"
                    variant="footnote1"
                    family="robotoMedium"
                  >
                    Celular
                  </Typography>
                  <Typography
                    className="w-full text-end sm:text-start"
                    variant="footnote1"
                  >
                    {phoneMask(user.phone)}
                  </Typography>
                </div>
                <div className="flex h-7 items-center">
                  <Typography
                    className="w-32"
                    variant="footnote1"
                    family="robotoMedium"
                  >
                    E-mail
                  </Typography>
                  <Typography
                    className="w-full text-end sm:text-start"
                    variant="footnote1"
                  >
                    {user.email}
                  </Typography>
                </div>
                <div className="flex h-7 items-center">
                  <Typography
                    className="w-32"
                    variant="footnote1"
                    family="robotoMedium"
                  >
                    Nº de Matrícula
                  </Typography>
                  <Typography
                    className="w-full text-end sm:text-start"
                    variant="footnote1"
                  >
                    {user.registrationNumber}
                  </Typography>
                </div>
                <div className="flex h-7 items-center">
                  <Typography
                    className="w-32"
                    variant="footnote1"
                    family="robotoMedium"
                  >
                    Criado
                  </Typography>
                  <Typography
                    className="w-full text-end sm:text-start"
                    variant="footnote1"
                  >
                    {new Intl.DateTimeFormat('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'medium',
                    }).format(new Date(user.createdAt))}
                  </Typography>
                </div>
                <div className="flex h-7 items-center">
                  <Typography
                    className="w-32"
                    variant="footnote1"
                    family="robotoMedium"
                  >
                    Modificado
                  </Typography>
                  <Typography
                    className="w-full text-end sm:text-start"
                    variant="footnote1"
                  >
                    {new Intl.DateTimeFormat('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'medium',
                    }).format(new Date(user.updatedAt))}
                  </Typography>
                </div>
              </div>
            </div>
          ) : (
            <ShowUserSkeleton />
          )}
          <div className="mt-4 gap-2 space-y-4">
            <Button
              disabled={disableSmsAndEmail}
              label="Enviar senha via SMS"
              color="blue"
              onClick={handleSendSMSNotificationClick}
            />
            <Button
              disabled={disableSmsAndEmail}
              label="Enviar senha via email"
              color="blue"
              onClick={handleSendEmailNotificationClick}
            />
          </div>
        </div>
        <div className="w-full h-fit mt-5">
          <UsersTab>
            <Tab.Panels className="rounded-lg h-full w-full">
              <UsersUserGroupsTab userGroup={userGroup} userId={user.id} />
              <UsersPoliciesTab user_id={user.id} />
            </Tab.Panels>
          </UsersTab>
        </div>
      </div>
    </>
  );
};

export default ShowUser;

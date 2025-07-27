import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import router from 'next/router';
import { Tab } from '@headlessui/react';
import { Typography, Icon, Button, ButtonRounded } from 'printer-ui';
import { useAuth, useModal, useSnackbar } from '../../../hooks';
import { UserGroupService, OrganizationService } from '../../../services';
import { UserGroup } from '../../../types';
import Tabs from '../../../components/Tab';
import Layout, { Header } from '../../../components/Layout';
import UpdateGroup from '../../../components/Modal/UserGroup/Update/Update';
import UserGroupPoliciesTab from '../../../components/Tab/UserGroupsTab/UserGroupsPoliciesTab/UserGroupsPoliciesTab';
import UserGroupUsersTab from '../../../components/Tab/UserGroupsTab/UserGroupsUsersTab/UserGroupsUsersTab';

const ViewGroupPage = () => {
  const { showSnackbar } = useSnackbar();
  const { openModal } = useModal();
  const { token, subdomain } = useAuth();
  const [isLoading] = React.useState(false);

  const [group, setGroup] = React.useState<UserGroup>({
    id: null,
    name: '',
    description: '',
    organization_id: null,
    status: 'active',
    users_count: null,
    created_at: '',
    updated_at: '',
    policies_count: null,
    organization: {
      corporate_name: '',
    },
  });

  const getGroup = React.useCallback(
    async (groupID: any) => {
      UserGroupService.show(token, subdomain, groupID)
        .then((res) => {
          setGroup(res.data);
        })
        .catch((error) => {
          showSnackbar(error.response.data.message, 'error');
          router.push(`/printer-cloud/user-groups`);
        });
    },
    [router]
  );

  const [organizationCNPJ, setOrganizationCNPJ] = React.useState<string>('');

  const handleUpdate = () => {
    openModal(
      <UpdateGroup
        group_id={group.id}
        organization_id={group.organization_id}
        organization_name={group.organization.corporate_name}
        organization_cnpj={organizationCNPJ}
      />
    );
  };

  React.useEffect(() => {
    router.query.groupID && getGroup(router.query.groupID);
  }, [router.query.groupID, getGroup]);

  if (!router.query.groupID) return <p>erroooooo</p>;

  return (
    <Layout>
      <Head>
        <title>Printer Cloud | Visualizar grupo</title>
      </Head>
      <Header className="pr-5 sm:px-5 py-5 justify-between truncate">
        <div className="flex space-x-5 px-2 w-full truncate items-center h-full">
          <div className="hidden w-0 sm:block sm:w-fit">
            <Link href="/printer-cloud/user-groups">
              <ButtonRounded onClick={() => null}>
                <Icon
                  alt="return"
                  name="return"
                  w={30}
                  h={30}
                  color="gray"
                  fill
                  stroke
                ></Icon>
              </ButtonRounded>
            </Link>
          </div>
          <Icon alt="group" name="group" stroke />
          <Typography
            family="robotoBold"
            variant="title3"
            className="w-full sm:truncate-none truncate"
          >
            {group.name}
          </Typography>
          <div className="justify-end flex items-center sm:w-full">
            <Button
              color="info"
              label="Editar"
              onClick={handleUpdate}
              disabled={isLoading}
            />
          </div>
        </div>
      </Header>
      <main className="flex-none w-fit">
        <div className="sm:flex">
          <div className="w-fit pr-4">
            <div className="sm:flex-none">
              <div className="flex items-center sm:pt-11 pb-5">
                <Icon
                  className="mr-2"
                  alt="group"
                  name="group"
                  stroke
                  w={25}
                  h={25}
                />
                <Typography variant="title2" family="robotoBold">
                  Dados do grupo
                </Typography>
              </div>
              <div className="flex space-x-4 mb-5">
                <Typography
                  className="w-20 sm:w-48"
                  variant="footnote1"
                  family="robotoBold"
                >
                  Instituição
                </Typography>
                <Typography
                  variant="footnote1"
                  family="roboto"
                  className="sm:w-64"
                >
                  {group.organization.corporate_name}
                </Typography>
              </div>
              <div className="flex space-x-4 mb-5">
                <Typography
                  className="w-20 sm:w-48"
                  variant="footnote1"
                  family="robotoBold"
                >
                  Descrição
                </Typography>
                <Typography
                  variant="footnote1"
                  family="roboto"
                  className="sm:w-64"
                >
                  {group.description}
                </Typography>
              </div>
              <div className="flex space-x-4 mb-5">
                <Typography
                  className="w-20 sm:w-48"
                  variant="footnote1"
                  family="robotoBold"
                >
                  Criado
                </Typography>
                <Typography
                  variant="footnote1"
                  family="roboto"
                  className="sm:w-64"
                >
                  {new Date(Date.parse(group.created_at)).toLocaleDateString(
                    'pt-br'
                  )}{' '}
                  às{' '}
                  {new Date(Date.parse(group.created_at)).toLocaleTimeString(
                    'pt-br'
                  )}
                </Typography>
              </div>
              <div className="flex space-x-4 mb-5">
                <Typography
                  className="w-20 sm:w-48"
                  variant="footnote1"
                  family="robotoBold"
                >
                  Modificado
                </Typography>
                <Typography
                  variant="footnote1"
                  family="roboto"
                  className="sm:w-64"
                >
                  {new Date(Date.parse(group.updated_at)).toLocaleDateString(
                    'pt-br'
                  )}{' '}
                  às{' '}
                  {new Date(Date.parse(group.updated_at)).toLocaleTimeString(
                    'pt-br'
                  )}
                </Typography>
              </div>
              <div className="flex space-x-4 mb-5">
                <Typography
                  className="w-20 sm:w-48"
                  variant="footnote1"
                  family="robotoBold"
                >
                  Quantidade de usuários
                </Typography>
                <Typography
                  variant="footnote1"
                  family="roboto"
                  className="sm:w-64"
                >
                  {group.users_count}
                </Typography>
              </div>
              <div className="flex space-x-4 mb-5">
                <Typography
                  className="w-20 sm:w-48"
                  variant="footnote1"
                  family="robotoBold"
                >
                  Quantidade de permissões
                </Typography>
                <Typography
                  variant="footnote1"
                  family="roboto"
                  className="sm:w-64"
                >
                  {group.policies_count}
                </Typography>
              </div>
            </div>
          </div>
          <div className="items-center sm:pt-11">
            <Tabs>
              <Tab.Panels className="rounded-lg h-full w-full">
                <UserGroupUsersTab
                  userGroupID={router.query.groupID}
                  userGroup={group}
                />
                <UserGroupPoliciesTab userGroup={group} />
              </Tab.Panels>
            </Tabs>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ViewGroupPage;

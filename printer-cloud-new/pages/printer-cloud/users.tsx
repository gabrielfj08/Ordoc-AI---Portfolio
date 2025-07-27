import * as React from 'react';
import Head from 'next/head';
import { Button, Select, Input, Typography, Item, Icon } from 'printer-ui';
import { useModal } from '../../hooks';
import { IndexUsersParams } from '../../services/types';
import Layout, { Header } from '../../components/Layout';
import UsersContainer from '../../components/Table/Users';
import { UserFilter } from '../../components/FilterButtons';
import NewUserModal from '../../PrinterCloud/Users/Modals/New';

const UsersPage = () => {
  const { openModal } = useModal();

  const handleNewUserClick = () => {
    openModal(<NewUserModal />);
  };

  const [selectedStatus, setSelectedStatus] = React.useState('');

  const items: Array<Item> = [
    {
      id: '1',
      value: 'Ordem Alfabética A-Z',
    },
    {
      id: '2',
      value: 'Ordem Alfabética Z-A',
    },
    {
      id: '3',
      value: 'Mais recentes',
    },
    {
      id: '4',
      value: 'Mais antigos',
    },
  ];

  const sortMappings: Record<string, Record<string, string>> = {
    '1': {
      order: 'name',
      direction: 'asc',
    },
    '2': {
      order: 'name',
      direction: 'desc',
    },
    '3': {
      order: 'created_at',
      direction: 'desc',
    },
    '4': {
      order: 'created_at',
      direction: 'asc',
    },
  };

  const [selectedItem, setSelectedItem] = React.useState<Item>(items[0]);
  const [queryParams, setQueryParams] = React.useState<IndexUsersParams>({
    q: '',
    status: '',
    page: 1,
    order: 'name',
    direction: 'asc',
    organization_id_by_membership: null,
    printer_cloud_user_group_id: null,
    policy_id: null,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams({
      ...queryParams,
      q: event.target.value,
      page: 1,
    });
  };

  const handleClearFilter = () => {
    setQueryParams({
      ...queryParams,
      status: '',
      organization_id_by_membership: null,
    });
    setSelectedStatus('');
  };

  const handleSortChange = (item: Item) => {
    setQueryParams({
      ...queryParams,
      ...sortMappings[item.id],
      page: 1,
    });
    setSelectedItem(item);
  };

  const handlePageChange = (page: number) => {
    setQueryParams({
      ...queryParams,
      page: page,
    });
  };

  const handleFilterButtonChange = () => {
    setQueryParams({
      ...queryParams,
      status: selectedStatus,
      page: 1,
    });
  };

  return (
    <Layout>
      <Head>
        <title> Printer Cloud | Usuários</title>
      </Head>
      <Header>
        <div className="w-full flex items-center pt-5 sm:pt-0 justify-between">
          <div className="pl-4">
            <Typography family="robotoBold" variant="title3">
              Usuários
            </Typography>
          </div>
          <div className="sm:hidden pr-4 z-20">
            <Select
              size="sm"
              w={44}
              items={items}
              selectedItem={selectedItem}
              setSelectedItem={handleSortChange}
            />
          </div>
        </div>
      </Header>
      <main className="px-4 sm:mr-10 mr-0">
        <div className="sm:flex hidden justify-between my-6 items-center w-auto">
          <div className="flex space-x-2.5">
            <Button
              className="inline-flex"
              size="md"
              color="info"
              label="Usuários"
              type="button"
              onClick={handleNewUserClick}
            >
              <Button.Icon
                name="plus"
                alt="plus"
                color="white"
                w={22}
                h={22}
                stroke
              />
            </Button>
            <Input
              onChange={handleSearchChange}
              value={queryParams.q}
              type="search"
              name="q"
              float
              size="md"
              w={96}
            >
              <Icon alt="search" name="search" color="gray" stroke />
            </Input>
            <div className="mr-20">
              <UserFilter
                onClick={handleFilterButtonChange}
                onReset={handleClearFilter}
                status={queryParams.status}
                organization_id={queryParams.organization_id_by_membership}
              >
                <div className="space-y-4 items-center">
                  <Typography variant="footnote1" family="robotoMedium">
                    Status:
                  </Typography>
                  <div className="space-x-6 text-xs sm:text-[15px] font-roboto-400">
                    <span className="space-x-2">
                      <input
                        id="active"
                        onChange={() => setSelectedStatus('active,')}
                        type="radio"
                        name="status"
                        value="active,"
                        checked={selectedStatus === 'active,' ? true : false}
                      />
                      <label htmlFor="active">Ativos</label>
                    </span>
                    <span className="space-x-2">
                      <input
                        id="inactive"
                        onChange={() => setSelectedStatus('inactive,')}
                        type="radio"
                        name="status"
                        value="inactive,"
                        checked={selectedStatus === 'inactive,' ? true : false}
                      />
                      <label htmlFor="inactive">Inativos</label>
                    </span>
                    <span className="space-x-2">
                      <input
                        id="blocked"
                        onChange={() => setSelectedStatus('blocked,')}
                        type="radio"
                        name="status"
                        value="blocked,"
                        checked={selectedStatus === 'blocked,' ? true : false}
                      />
                      <label htmlFor="blocked">Bloqueados</label>
                    </span>
                  </div>
                </div>
              </UserFilter>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <Typography variant="footnote1" color="gray">
              Ordenar por
            </Typography>
            <Select
              items={items}
              selectedItem={selectedItem}
              setSelectedItem={handleSortChange}
            />
          </div>
        </div>
        <div className="sm:invisible sm:h-0 visible mt-4">
          <div className="mb-4">
            <Input
              onChange={handleSearchChange}
              value={queryParams.q}
              type="search"
              name="q"
              float
              size="md"
              w="auto"
            >
              <Icon alt="search" name="search" color="gray" stroke />
            </Input>
          </div>
          <div className="flex justify-between pb-4 space-x-4 w-full">
            <Button
              className="inline-flex truncate"
              size="md"
              color="info"
              label="Adicionar usuário"
              type="button"
              onClick={handleNewUserClick}
            >
              <Button.Icon
                name="plus"
                alt="plus"
                color="white"
                w={22}
                h={22}
                stroke
              />
            </Button>
            <div className="mr-20">
              <UserFilter
                onClick={handleFilterButtonChange}
                onReset={handleClearFilter}
                status={queryParams.status}
                organization_id={queryParams.organization_id_by_membership}
              >
                <div className="space-y-4 items-center">
                  <Typography variant="footnote1" family="robotoMedium">
                    Status:
                  </Typography>
                  <div className="space-x-6 text-xs sm:text-[15px] font-roboto-400">
                    <span className="space-x-2">
                      <input
                        id="active"
                        onChange={() => setSelectedStatus('active,')}
                        type="radio"
                        name="status"
                        value="active,"
                        checked={selectedStatus === 'active,' ? true : false}
                      />
                      <label htmlFor="active">Ativos</label>
                    </span>
                    <span className="space-x-2">
                      <input
                        id="inactive"
                        onChange={() => setSelectedStatus('inactive,')}
                        type="radio"
                        name="status"
                        value="inactive,"
                        checked={selectedStatus === 'inactive,' ? true : false}
                      />
                      <label htmlFor="inactive">Inativos</label>
                    </span>
                    <span className="space-x-2">
                      <input
                        id="blocked"
                        onChange={() => setSelectedStatus('blocked,')}
                        type="radio"
                        name="status"
                        value="blocked,"
                        checked={selectedStatus === 'blocked,' ? true : false}
                      />
                      <label htmlFor="blocked">Bloqueados</label>
                    </span>
                  </div>
                </div>
              </UserFilter>
            </div>
          </div>
        </div>
        <UsersContainer filterParams={queryParams} setPage={handlePageChange} />
      </main>
    </Layout>
  );
};

export default UsersPage;

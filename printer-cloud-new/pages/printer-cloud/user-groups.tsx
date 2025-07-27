import * as React from 'react';
import Head from 'next/head';
import { Button, Select, Input, Typography, Item, Icon } from 'printer-ui';
import { useModal } from '../../hooks';
import Layout, { Header } from '../../components/Layout';
import UserGroupsContainer from '../../components/Table/UserGroups';
import { UserGroupFilter } from '../../components/FilterButtons';
import CreateUserGroupModal from '../../components/Modal/UserGroup/Create';

const UserGroupsPage = () => {
  const { openModal } = useModal();

  const [selectedOrganization, setSelectedOrganization] = React.useState({
    id: '',
    value: 'Selecione a instituição',
  });

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
    '0': {},
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
  const [queryParams, setQueryParams] = React.useState({
    q: '',
    status: '',
    page: '1',
    order: 'name',
    direction: 'asc',
    organization_id: '',
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams({
      ...queryParams,
      q: event.target.value,
      page: '1',
    });
  };

  const handleClearFilter = () => {
    setQueryParams({
      ...queryParams,
      status: '',
      organization_id: '',
    });
    setSelectedOrganization({ id: '', value: 'Selecione a instituição' });
    setSelectedStatus('');
  };

  const handleSortChange = (item: Item) => {
    setQueryParams({
      ...queryParams,
      ...sortMappings[item.id],
      page: '1',
    });
    setSelectedItem(item);
  };

  const handlePageChange = (page: number) => {
    setQueryParams({
      ...queryParams,
      page: page.toString(),
    });
  };

  const handleFilterButtonChange = () => {
    setQueryParams({
      ...queryParams,
      organization_id: `${selectedOrganization.id}`,
      status: selectedStatus,
      page: '1',
    });
  };

  const handleCreate = () => {
    openModal(<CreateUserGroupModal />);
  };

  return (
    <Layout>
      <Head>
        <title> Printer Cloud | Grupos</title>
      </Head>
      <Header>
        <div className="w-full flex items-center pt-5 sm:pt-0 justify-between">
          <div className="pl-4">
            <Typography family="robotoBold" variant="title3">
              Grupos
            </Typography>
          </div>
          <div className="sm:hidden pr-4">
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
      <main className="px-4">
        <div className="sm:flex hidden justify-between my-6 items-center w-auto">
          <div className="flex space-x-2.5">
            <Button
              className="inline-flex"
              size="md"
              color="info"
              label="Grupos"
              type="button"
              onClick={handleCreate}
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
            <UserGroupFilter
              onClick={handleFilterButtonChange}
              onReset={handleClearFilter}
              status={queryParams.status}
              organization_id={queryParams.organization_id}
            >
              <div className="space-y-5">
                <div className="space-x-12 flex items-center">
                  <Typography variant="footnote1" family="robotoMedium">
                    Status
                  </Typography>
                  <div className="space-x-6 text-xs sm:text-[15px] font-roboto-400">
                    <span className="space-x-2">
                      <input
                        id="active"
                        onChange={() => setSelectedStatus('active,')}
                        type="radio"
                        name="status"
                        value="active"
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
                        value="inactive"
                        checked={selectedStatus === 'inactive,' ? true : false}
                      />
                      <label htmlFor="inactive">Inativos</label>
                    </span>
                  </div>
                </div>
              </div>
            </UserGroupFilter>
          </div>
          <div className="flex items-center justify-center space-x-4 pr-6">
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
              onClick={() => {}}
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
            <UserGroupFilter
              onClick={handleFilterButtonChange}
              onReset={handleClearFilter}
              status={queryParams.status}
              organization_id={queryParams.organization_id}
            >
              <div className="space-y-5">
                <div className="space-x-12 flex items-center">
                  <Typography variant="footnote1" family="robotoMedium">
                    Status
                  </Typography>
                  <div className="space-x-6 text-xs sm:text-[15px] font-roboto-400">
                    <span className="space-x-2">
                      <input
                        id="active"
                        onChange={() => setSelectedStatus('active,')}
                        type="radio"
                        name="status"
                        value="active,"
                        checked={selectedStatus === 'active' ? true : false}
                      />
                      <label htmlFor="active">Ativos</label>
                    </span>
                    <span className="space-x-2">
                      <input
                        id="inactive"
                        onChange={() => setSelectedStatus('inactive')}
                        type="radio"
                        name="status"
                        value="inactive"
                        checked={selectedStatus === 'inactive' ? true : false}
                      />
                      <label htmlFor="inactive">Inativos</label>
                    </span>
                  </div>
                </div>
              </div>
            </UserGroupFilter>
          </div>
        </div>
        <UserGroupsContainer
          queryParams={queryParams}
          page={parseInt(queryParams.page)}
          setPage={handlePageChange}
        />
      </main>
    </Layout>
  );
};

export default UserGroupsPage;

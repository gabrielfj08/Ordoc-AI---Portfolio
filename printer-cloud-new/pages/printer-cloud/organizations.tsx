import * as React from 'react';
import { Icon, Input, Select, Item, Typography } from 'printer-ui';
import OrganizationsContainer from '../../components/Table/Organizations';
import { OrganizationFilter } from '../../components/FilterButtons';
import Layout, { Header } from '../../components/Layout';
import Head from 'next/head';

const OrganizationsPage = () => {
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

  const [selectedItem, setSelectedItem] = React.useState<Item>(items[0]);
  const [selectedStatus, setSelectedStatus] = React.useState('');

  const sortMappings: Record<string, Record<string, string>> = {
    '0': {},
    '1': {
      order: 'corporate_name',
      direction: 'asc',
    },
    '2': {
      order: 'corporate_name',
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

  const [queryParams, setQueryParams] = React.useState({
    q: '',
    status: '',
    page: '1',
    order: 'corporate_name',
    direction: 'asc',
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
    });
    setSelectedStatus('');
  };

  const handleStatusChange = () => {
    setQueryParams({
      ...queryParams,
      status: selectedStatus,
      page: '1',
    });
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

  return (
    <div className="w-screen">
      <Layout>
        <Head>
          <title> Printer Cloud | Instituição</title>
        </Head>
        <Header>
          <div className="w-full flex justify-between">
            <div className="pl-4">
              <Typography family="robotoBold" variant="title3">
                Instituição
              </Typography>
            </div>
            <div className="sm:invisible pr-4">
              <Select
                items={items}
                selectedItem={selectedItem}
                setSelectedItem={handleSortChange}
              />
            </div>
          </div>
        </Header>
        <main>
          <div className="flex justify-between my-6 items-center w-auto">
            <div className="flex space-x-2.5">
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
              <OrganizationFilter
                onClick={handleStatusChange}
                onReset={handleClearFilter}
                status={queryParams.status}
                organization_id={null}
              >
                <div className="space-x-7 flex items-center">
                  <Typography variant="footnote1" family="robotoMedium">
                    Status
                  </Typography>
                  <div className="flex space-x-8 font-roboto-400 text-xs sm:text-[15px] pr-20">
                    <span className="space-x-2">
                      <input
                        id="active"
                        onChange={() => setSelectedStatus('active,')}
                        type="radio"
                        name="status"
                        checked={selectedStatus === 'active,' ? true : false}
                        value="active,"
                      />
                      <label htmlFor="active">Ativas</label>
                    </span>
                    <span className="space-x-2">
                      <input
                        id="inactive"
                        onChange={() => setSelectedStatus('inactive,')}
                        type="radio"
                        name="status"
                        checked={selectedStatus === 'inactive,' ? true : false}
                        value="inactive,"
                      />
                      <label htmlFor="inactive">Inativas</label>
                    </span>
                  </div>
                </div>
              </OrganizationFilter>
            </div>
            <div className="flex items-center justify-center space-x-4 invisible sm:visible sm:pr-6">
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
          <OrganizationsContainer
            queryParams={queryParams}
            page={parseInt(queryParams.page)}
            setPage={handlePageChange}
          />
        </main>
      </Layout>
    </div>
  );
};

export default OrganizationsPage;

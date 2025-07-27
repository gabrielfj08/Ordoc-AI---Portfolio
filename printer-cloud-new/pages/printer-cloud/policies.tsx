import * as React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Select, Input, Typography, Item, Icon } from 'printer-ui';
import { useAuth } from '../../hooks';
import { cnpjMask, getSubdomain } from '../../utils';
import { OrganizationService } from '../../services';
import { IndexPoliciesParams } from '../../types/policy';
import Layout, { Header } from '../../components/Layout';
import { PolicyFilter } from '../../components/FilterButtons';
import PoliciesContainer from '../../components/Table/Policies';

const PoliciesPage = () => {
  const { token } = useAuth();
  const [organizations, setOrganizations] = React.useState<any[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    OrganizationService.index(token, getSubdomain(), '').then((res) => {
      setOrganizations(
        res.organizations.map((items: any) => {
          return {
            id: `${items.id}`,
            value: `${cnpjMask(items.cnpj)} - ${items.corporate_name}`,
          };
        })
      );
    });
  }, [setOrganizations]);

  const [selectedOrganization, setSelectedOrganization] = React.useState({
    id: '',
    value: 'Selecione a instituição',
  });

  const [selectedSource, setSelectedSource] = React.useState('');

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
  const [queryParams, setQueryParams] = React.useState<IndexPoliciesParams>({
    q: '',
    source: '',
    page: 1,
    order: 'name',
    direction: 'asc',
    organization_id: null,
    user_group_id: null,
    user_id: null,
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
      source: '',
      organization_id: null,
    });
    setSelectedOrganization({ id: '', value: 'Selecione a instituição' });
    setSelectedSource('');
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
      organization_id: parseInt(selectedOrganization.id),
      source: selectedSource,
      page: 1,
    });
  };

  return (
    <Layout>
      <Head>
        <title> Printer Cloud | Permissões</title>
      </Head>
      <Header>
        <div className="w-full flex items-center pt-5 sm:pt-0 justify-between">
          <div className="pl-4">
            <Typography family="robotoBold" variant="title3">
              Permissões
            </Typography>
          </div>
          <div className="sm:hidden z-30 pr-4">
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
              label="Permissões"
              type="button"
              onClick={() => router.push('policies/new')}
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
            <PolicyFilter
              onClick={handleFilterButtonChange}
              onReset={handleClearFilter}
              status={queryParams.source}
              organization_id={queryParams.organization_id}
            >
              <div className="space-y-5">
                <div className="space-x-12 flex items-center">
                  <Typography variant="footnote1" family="robotoMedium">
                    Criação:
                  </Typography>
                  <div className="space-x-6 text-xs sm:text-[15px] font-roboto-400">
                    <span className="space-x-2">
                      <input
                        id="printer_cloud_managed"
                        onChange={() =>
                          setSelectedSource('printer_cloud_managed,')
                        }
                        type="radio"
                        name="source"
                        value="printer_cloud_managed,"
                        checked={
                          selectedSource === 'printer_cloud_managed,'
                            ? true
                            : false
                        }
                      />
                      <label htmlFor="printer_cloud_managed">
                        Criado por Printer Cloud
                      </label>
                    </span>
                    <span className="space-x-2">
                      <input
                        id="customer_managed"
                        onChange={() => setSelectedSource('customer_managed,')}
                        type="radio"
                        name="source"
                        value="customer_managed,"
                        checked={
                          selectedSource === 'customer_managed,' ? true : false
                        }
                      />
                      <label htmlFor="customer_managed">
                        Criado por usuário
                      </label>
                    </span>
                  </div>
                </div>
              </div>
            </PolicyFilter>
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
              label="Permissões"
              type="button"
              onClick={() => router.push('policies/new')}
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
              <PolicyFilter
                onClick={handleFilterButtonChange}
                onReset={handleClearFilter}
                status={queryParams.source}
                organization_id={queryParams.organization_id}
              >
                <Typography variant="footnote1" family="robotoMedium">
                  Criação:
                </Typography>
                <div className="space-y-2 pt-2 text-xs sm:text-[15px] font-roboto-400">
                  <span className="flex space-x-2">
                    <input
                      id="printer_cloud_managed_mobile"
                      onChange={() =>
                        setSelectedSource('printer_cloud_managed,')
                      }
                      type="radio"
                      name="customer_managed_mobile"
                      value="printer_cloud_managed,"
                      checked={
                        selectedSource === 'printer_cloud_managed,'
                          ? true
                          : false
                      }
                    />
                    <label htmlFor="printer_cloud_managed">
                      Criado por Printer Cloud
                    </label>
                  </span>
                  <span className="flex space-x-2">
                    <input
                      id="customer_managed_mobile"
                      onChange={() => setSelectedSource('customer_managed,')}
                      type="radio"
                      name="customer_managed_mobile"
                      value="customer_managed,"
                      checked={
                        selectedSource === 'customer_managed,' ? true : false
                      }
                    />
                    <label htmlFor="customer_managed">Criado por usuário</label>
                  </span>
                </div>
              </PolicyFilter>
            </div>
          </div>
        </div>
        <PoliciesContainer
          setPage={handlePageChange}
          filterParams={{
            page: queryParams.page,
            user_group_id: queryParams.user_group_id,
            organization_id: queryParams.organization_id,
            q: queryParams.q,
            source: queryParams.source,
            user_id: queryParams.user_id,
            order: queryParams.order,
            direction: queryParams.direction,
          }}
        />
      </main>
    </Layout>
  );
};

export default PoliciesPage;

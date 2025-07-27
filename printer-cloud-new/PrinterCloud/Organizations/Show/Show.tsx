import * as React from 'react';
import Link from 'next/link';
import router from 'next/router';
import Head from 'next/head';
import {
  Avatar,
  Button,
  ButtonRounded,
  Icon,
  StorageBar,
  Typography,
} from 'printer-ui';
import { useAuth } from '../../../hooks';
import { ReportService } from '../../../services';
import { ShowOrganizationProps } from './types';
import { ReportsProps } from '../../../components/Widget/types';
import { Header } from '../../../components/Layout';
import WidgetAir from '../../../components/Widget/Air';
import WidgetFlow from '../../../components/Widget/Flow';

const ShowOrganization = ({ organization }: ShowOrganizationProps) => {
  const { token, subdomain } = useAuth();
  const [airUsedStorage, setAirUsedStorage] =
    React.useState<Array<ReportsProps>>();

  const [flowUsedStorage, setFlowUsedStorage] =
    React.useState<Array<ReportsProps>>();

  const [usedStorage, setUsedStorage] = React.useState(0);

  const [storageAvailable, setStorageAvailable] = React.useState(0);

  const getAirUsedStorage = React.useCallback(
    async (organizationId: any) => {
      ReportService.index(organizationId, subdomain, 'air_used_storage', token)
        .then((res) => {
          setAirUsedStorage(res.data['printer_reports/reports']);
        })
        .catch(() => {
          router.push(`/printer-cloud/organizations`);
        });
    },
    [router]
  );

  React.useEffect(() => {
    router.query.organizationId &&
      getAirUsedStorage(router.query.organizationId);
  }, [getAirUsedStorage, router.query.organizationId]);

  const getFlowUsedStorage = React.useCallback(
    async (organizationId: any) => {
      ReportService.index(organizationId, subdomain, 'flow_used_storage', token)
        .then((res) => {
          setFlowUsedStorage(res.data['printer_reports/reports']);
        })
        .catch((error) => {
          router.push(`/printer-cloud/organizations`);
        });
    },
    [router]
  );

  React.useEffect(() => {
    router.query.organizationId &&
      getFlowUsedStorage(router.query.organizationId);
  }, [getFlowUsedStorage, router.query.organizationId]);

  React.useLayoutEffect(() => {
    setUsedStorage(
      Number(airUsedStorage?.at(0)?.data) + Number(flowUsedStorage?.at(0)?.data)
    );
    setStorageAvailable(
      Number(organization.storageLimit) -
        (Number(airUsedStorage?.at(0)?.data) +
          Number(flowUsedStorage?.at(0)?.data))
    );
  }, [airUsedStorage, flowUsedStorage, organization.storageLimit]);

  const data = [
    ['App', 'Air', 'Flow', 'Printer Cloud', 'none'],
    [
      '',
      Number(airUsedStorage),
      Number(flowUsedStorage),
      3,
      Number(storageAvailable),
    ],
  ];

  return (
    <>
      <Head>
        <title>Printer Cloud | Visualizar instituição</title>
      </Head>
      <Header className="pr-5 sm:px-5 py-0 justify-between">
        <div className="flex space-x-5 px-2 w-full items-center h-full">
          <div className="hidden w-0 sm:block sm:w-fit">
            <Link href="/printer-cloud/organizations">
              <ButtonRounded onClick={() => null}>
                <Icon
                  alt="return"
                  name="return"
                  w={30}
                  h={30}
                  color="gray"
                  fill
                  stroke
                />
              </ButtonRounded>
            </Link>
          </div>
          <div className="w-24">
            <Avatar
              size="md"
              placeholder={organization.corporateName.charAt(0)}
              src={
                organization.logoUrl
                  ? organization.logoUrl
                  : '/assets/institution-logo.png'
              }
            />
          </div>
          <Typography
            family="robotoBold"
            variant="title3"
            className="w-full sm:truncate-none truncate"
          >
            {organization.corporateName}
          </Typography>
          <div className="justify-end sm:flex items-center sm:w-full hidden sm:pt-5">
            <StorageBar
              title="Cloud Storage"
              value={`${organization.storageLimit} GiB`}
              legend={`${usedStorage.toFixed(1)} GiB de ${
                organization.storageLimit
              } GiB utilizados`}
              data={data}
            />
          </div>
          <Link href={`/printer-cloud/organizations/${organization.id}/edit`}>
            <Button color="info" label="Editar" disabled={false} />
          </Link>
        </div>
      </Header>
      <main className="flex-none w-fit">
        <div className="sm:invisible visible sm:h-0 pl-7">
          <StorageBar
            title="Cloud Storage"
            value={`${organization.storageLimit} GiB`}
            legend={`${usedStorage.toFixed(1)} GiB de ${
              organization.storageLimit
            } GiB utilizados`}
            data={data}
          />
        </div>
        <div className="sm:flex my-6">
          <div className="w-fit pr-4">
            <div className="sm:flex-none">
              <div className="flex items-center pb-5">
                <Icon
                  className="mr-2"
                  alt="institution"
                  name="institution"
                  stroke
                  w={25}
                  h={25}
                />
                <Typography variant="title2" family="robotoBold">
                  Dados da instituição
                </Typography>
              </div>
              <div className="flex space-x-4 mb-5">
                <Typography
                  className="w-20 sm:w-44"
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
                  {organization.corporateName}
                </Typography>
              </div>
              <div className="flex space-x-4 mb-5">
                <Typography
                  className="w-20 sm:w-44"
                  variant="footnote1"
                  family="robotoBold"
                >
                  CNPJ
                </Typography>
                <Typography
                  variant="footnote1"
                  family="roboto"
                  className="sm:w-64"
                >
                  {organization.cnpj}
                </Typography>
              </div>

              <div className="flex space-x-4 mb-5">
                <Typography
                  className="w-20 sm:w-44"
                  variant="footnote1"
                  family="robotoBold"
                >
                  Nome do responsável
                </Typography>
                <Typography
                  variant="footnote1"
                  family="roboto"
                  className="sm:w-64"
                >
                  {organization.contactName}
                </Typography>
              </div>
              <div className="flex space-x-4 mb-5">
                <Typography
                  className="w-20 sm:w-44"
                  variant="footnote1"
                  family="robotoBold"
                >
                  CEP
                </Typography>
                <Typography variant="footnote1" family="roboto">
                  {organization.address.postalCode}
                </Typography>
              </div>
              <div className="flex space-x-4 mb-5">
                <Typography
                  className="w-20 sm:w-44"
                  variant="footnote1"
                  family="robotoBold"
                >
                  Endereço
                </Typography>
                <Typography variant="footnote1" family="roboto">
                  {organization.address.street}, {organization.address.number}
                  <br />
                  {organization.address.neighborhood},{' '}
                  {organization.address.city} - {organization.address.state}
                </Typography>
              </div>
              <div className="flex space-x-4 mb-8">
                <Typography
                  className="w-20 sm:w-44"
                  variant="footnote1"
                  family="robotoBold"
                >
                  Complemento
                </Typography>
                <Typography variant="footnote1" family="roboto">
                  {organization.address.complement}
                </Typography>
              </div>
            </div>
            <div className="sm:flex-none">
              <div className="flex items-center mb-5">
                <Icon
                  className="mr-2"
                  alt="manager"
                  name="manager"
                  stroke
                  w={25}
                  h={25}
                />
                <Typography variant="title2" family="robotoBold">
                  Contato
                </Typography>
              </div>
              <div className="flex space-x-4 mb-5">
                <Typography
                  className="w-20 sm:w-44"
                  variant="footnote1"
                  family="robotoBold"
                >
                  E-mail
                </Typography>
                <Typography
                  variant="footnote1"
                  family="roboto"
                  className="sm:w-64"
                >
                  {organization.email}
                </Typography>
              </div>
              <div className="flex space-x-4 mb-5">
                <Typography
                  className="w-20 sm:w-44"
                  variant="footnote1"
                  family="robotoBold"
                >
                  Telefone do responsável
                </Typography>
                <Typography
                  variant="footnote1"
                  family="roboto"
                  className="sm:w-64"
                >
                  {organization.contactPhone}
                </Typography>
              </div>
              <div className="flex space-x-4 mb-5">
                <Typography
                  className="w-20 sm:w-44"
                  variant="footnote1"
                  family="robotoBold"
                >
                  Telefone da instituição
                </Typography>
                <Typography
                  variant="footnote1"
                  family="roboto"
                  className="sm:w-64"
                >
                  {organization.phone}
                </Typography>
              </div>
              <div className="flex space-x-4 mb-5">
                <Typography
                  className="w-20 sm:w-44"
                  variant="footnote1"
                  family="robotoBold"
                >
                  Site
                </Typography>
                <Typography
                  variant="footnote1"
                  family="roboto"
                  className="sm:w-64"
                >
                  {organization.site}
                </Typography>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <WidgetAir
                organizationID={organization.id}
                storageLimit={organization.storageLimit}
              />
            </div>
            {/* <div className="mb-4">
              <WidgetFlow
                organizationID={organization.id}
                storageLimit={organization.storageLimit}
              />
            </div> */}
            <Typography
              className="flex justify-end"
              variant="caption"
              family="roboto"
            >
              Armazenamento das últimas 24 horas
            </Typography>
          </div>
        </div>
      </main>
    </>
  );
};

export default ShowOrganization;

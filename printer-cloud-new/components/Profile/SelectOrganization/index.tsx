import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon, Typography } from 'printer-ui';
import { useAuth } from '../../../hooks';
import { OrganizationService } from '../../../services';
import { getSubdomain } from '../../../utils';
import { SelectOrganizationContainerProps } from './types';
import SelectOrganization from './SelectOrganization';

const SelectOrganizationContainer = ({
  currentOrganizationId,
}: SelectOrganizationContainerProps) => {
  const { token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['organizations', token],
    queryFn: () => OrganizationService.indexV3(token, getSubdomain(), {}),
    retry: 0,
  });

  if (isError) return <div>Erro.</div>;

  if (isLoading) return <div>Carregando...</div>;

  return (
    <>
      {data.meta.total == 0 ? (
        <div className="items-center justify-center flex">
          <Icon name="info" alt="info" color="gray" stroke w={26} h={26} />
          <Typography variant="footnote2" color="gray">
            Nenhuma instituição encontrada
          </Typography>
        </div>
      ) : (
        <SelectOrganization
          organizations={data.organizations}
          currentOrganizationId={currentOrganizationId}
        />
      )}
    </>
  );
};

export default SelectOrganizationContainer;

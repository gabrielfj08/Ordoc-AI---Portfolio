import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { FieldDocumentTemplateService } from '../../../../../services/printer-flow';
import { FieldDocumentTemplateSelectOptionsContainerProps } from './types';
import FieldDocumentTemplateSelectOptionsError from './Error';
import FieldDocumentTemplateSelectOptions from './Options';

const UserSelectOptionsContainer = ({
  query,
  open,
}: FieldDocumentTemplateSelectOptionsContainerProps) => {
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['fieldDocumentTemplates', subdomain, token, query, {}],
    queryFn: () =>
      FieldDocumentTemplateService.index(token, subdomain, {
        q: query,
        perPage: 10,
        order: 'name',
        direction: 'asc',
      }),
  });

  if (isLoading) return null;

  if (isError)
    return (
      <div className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg bg-white py-1 z-10">
        <FieldDocumentTemplateSelectOptionsError />
      </div>
    );

  return (
    <div
      className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg ${
        open ? 'bg-white' : 'bg-transparent'
      } py-1 z-10`}
    >
      <FieldDocumentTemplateSelectOptions
        fieldDocumentTemplates={data.fieldDocumentTemplates}
      />
    </div>
  );
};

export default UserSelectOptionsContainer;

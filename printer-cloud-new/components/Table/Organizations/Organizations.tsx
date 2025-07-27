import * as React from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { Table, Typography } from 'printer-ui';
import { Organization } from '../../../types';
import { OrganizationsProps } from './types';
import OrganizationCell from './OrganizationCell';
import AppsCell from './AppsCell';

const Organizations = ({ organizations }: OrganizationsProps) => {
  const columnHelper = createColumnHelper<Organization>();

  const columns: ColumnDef<Organization, any>[] = [
    columnHelper.accessor((row) => row, {
      id: 'Nome',
      header: () => (
        <div className="max-w-[180px] sm:max-w-[500px] sm:min-w-full justify-start flex pl-4">
          <Typography color="gray">Nome</Typography>
        </div>
      ),
      cell: (info) => <OrganizationCell organization={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Apps',
      header: () => (
        <Typography color="gray" className="sm:block hidden">
          Apps
        </Typography>
      ),
      cell: (info) => (
        <AppsCell apps={info.getValue()} organization={info.getValue()} />
      ),
    }),
  ];

  return (
    <div className="w-full">
      <Table columns={columns} data={organizations} />
    </div>
  );
};

export default Organizations;

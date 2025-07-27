import { useRouter } from 'next/router';
import * as React from 'react';
import { App, Organization } from '../../../types';
import AppList from '../../AppList';
import Badge from '../../AppList/Badge';

export interface OrganizationCellProps {
  apps: Array<App>;
  organization: Organization;
}

const AppsCell = ({ organization }: OrganizationCellProps) => {
  const router = useRouter();
  const iconStatus = () => {
    if (organization.status == 'inactive') {
      return 'opacity-50';
    }
  };
  const appName = organization.apps.map((app) => {
    return app.name;
  });

  const className = `${iconStatus()} hidden sm:flex`;

  return (
    <div
      className="items-center"
      onClick={() => {
        router.push(`/printer-cloud/organizations/${organization.id}`);
      }}
    >
      <div className={className}>
        <AppList>
          <div className="flex space-x-1 items-center">
            <AppList.Air />
            {appName.includes('Printer Air') ? <Badge active /> : <Badge />}
          </div>
          <div className="flex space-x-1 items-center">
            <AppList.Cloud />
            {appName.includes('Printer Cloud') ? <Badge active /> : <Badge />}
          </div>
          <div className="flex space-x-2 items-center">
            <AppList.Flow />
            {appName.includes('Printer Flow') ? <Badge active /> : <Badge />}
          </div>
        </AppList>
      </div>
    </div>
  );
};

export default AppsCell;

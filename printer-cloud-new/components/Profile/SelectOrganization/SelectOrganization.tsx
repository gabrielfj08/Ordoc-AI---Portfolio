import * as React from 'react';
import router from 'next/router';
import { Item, Select } from 'printer-ui';
import { IndexOrganization } from '../../../services/types';
import { SelectOrganizationProps } from './types';

const SelectOrganization = ({
  organizations,
  currentOrganizationId,
}: SelectOrganizationProps) => {
  const handleClick = (item: Item) => {
    const organization = organizations.filter(
      (organization) => Number(item.id) === organization.id
    )[0];

    router.push(
      `/printer-air/my-air/organizations/${organization.id}/directories/${organization.rootDirectory.id}`
    );
  };

  return (
    <Select
      w={56}
      items={organizations.map((item: IndexOrganization) => {
        return {
          id: `${item.id}`,
          value: `${item.corporateName}`,
        };
      })}
      selectedItem={
        organizations
          .map((item: IndexOrganization) => {
            return {
              id: `${item.id}`,
              value: `${item.corporateName}`,
            };
          })
          .filter((item) => Number(item.id) === currentOrganizationId)[0]
      }
      setSelectedItem={handleClick}
    />
  );
};

export default SelectOrganization;

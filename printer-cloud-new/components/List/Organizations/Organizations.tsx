import * as React from 'react';
import getConfig from 'next/config';
import { Avatar, Button, List, Typography } from 'printer-ui';
import { useModal } from '../../../hooks';
import RemoveUserFromOrganization from '../../Modal/User/RemoveUserFromOrganization';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const OrganizationsList = ({ page, organizations, user_id }) => {
  const { openModal } = useModal();

  return (
    <React.Fragment key={page.nextId}>
      {organizations.map((organization) => (
        <List.Item
          className="flex justify-between w-full"
          key={organization.id}
        >
          <div className="flex space-x-2 items-center truncate">
            <Avatar
              size="md"
              src={
                organization.logoUrl
                  ? organization.logoUrl
                  : '/assets/institution-logo.png'
              }
              placeholder={organization.corporateName.charAt(0)}
            />
            <div className="space-y-1 truncate">
              <Typography
                variant="footnote1"
                family="robotoMedium"
                className="truncate"
              >
                {organization.corporateName}
              </Typography>
              <Typography variant="caption" className="truncate">
                {organization.email}
              </Typography>
            </div>
          </div>
          <div>
            <div className="hidden sm:block">
              <Button
                label="Remover"
                color="red"
                onClick={() =>
                  openModal(
                    <RemoveUserFromOrganization
                      organization={organization}
                      user_id={user_id}
                    />
                  )
                }
              />
            </div>
            <div className="sm:hidden">
              <Button
                label="Remover"
                size="sm"
                color="red"
                onClick={() =>
                  openModal(
                    <RemoveUserFromOrganization
                      organization={organization}
                      user_id={user_id}
                    />
                  )
                }
              />
            </div>
          </div>
        </List.Item>
      ))}
    </React.Fragment>
  );
};

export default OrganizationsList;

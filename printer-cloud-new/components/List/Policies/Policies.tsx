import * as React from 'react';
import { Button, Icon, List, Typography } from 'printer-ui';
import { PoliciesListProps } from './types';
import { useModal } from '../../../hooks';
import RemovePolicyFromUserGroup from '../../Modal/UserGroup/RemovePolicy';
import RemovePolicyFromUser from '../../Modal/User/RemovePolicy';

const PoliciesList = ({ policies, page, group, userID }: PoliciesListProps) => {
  const { openModal } = useModal();

  return (
    <React.Fragment key={page.nextId}>
      {policies.map((policy) => (
        <List.Item key={policy.id}>
          <div className="flex items-center justify-between w-full">
            <div className="flex space-x-2 items-center truncate">
              <div className="flex space-x-0.5">
                <Icon name="done" alt="permission" color="gray" stroke />
                {policy.source === 'printer_cloud_managed' ? (
                  <Icon name="cloud" alt="cloud" color="blue" stroke />
                ) : (
                  <Icon name="manager" alt="customer" color="gray" stroke />
                )}
              </div>
              <div className="space-y-1 truncate">
                <Typography
                  variant="footnote1"
                  family="robotoMedium"
                  className="truncate"
                >
                  {policy.name}
                </Typography>
                <Typography variant="caption" className="truncate">
                  {policy.description}
                </Typography>
              </div>
            </div>
            <Button
              label="Remover"
              color="red"
              className="ml-9"
              onClick={() =>
                openModal(
                  group.id ? (
                    <RemovePolicyFromUserGroup
                      group_id={group.id}
                      group_name={group.name}
                      policy_id={policy.id}
                      policy_name={policy.name}
                    />
                  ) : (
                    <RemovePolicyFromUser
                      user_id={userID}
                      policy_id={policy.id}
                      policy_name={policy.name}
                    />
                  )
                )
              }
            />
          </div>
        </List.Item>
      ))}
    </React.Fragment>
  );
};

export default PoliciesList;

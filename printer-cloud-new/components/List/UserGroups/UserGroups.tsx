import { Button, Icon, List, Typography } from 'printer-ui';
import * as React from 'react';
import { useModal } from '../../../hooks';
import RemoveUserFromGroupModal from '../../Modal/UserGroup/RemoveUser/RemoveUserFromGroup';
import DetachFromUserGroup from '../../Modal/Policy/DetachFromUserGroup';

const UserGroupsList = ({ userGroups, page, user_id, policy }) => {
  const { openModal } = useModal();

  return (
    <React.Fragment>
      {userGroups.userGroups.map((userGroup) => (
        <List.Item className="flex justify-between w-full" key={page.nextId}>
          <div className="flex truncate space-x-3.5">
            <Icon name="group" alt="group" stroke />
            <div className="truncate pr-10">
              <Typography
                variant="footnote1"
                family="robotoMedium"
                className="truncate"
              >
                {userGroup.name}
              </Typography>
              <Typography variant="caption" className="truncate">
                {userGroup.description}
              </Typography>
            </div>
          </div>
          <div className="hidden sm:block">
            <Button
              label="Remover"
              color="red"
              onClick={() =>
                openModal(
                  user_id ? (
                    <RemoveUserFromGroupModal
                      userGroup={userGroup}
                      user_id={user_id}
                    />
                  ) : policy ? (
                    <DetachFromUserGroup
                      policy_id={policy.id}
                      user_group_id={userGroup.id}
                      user_group_name={userGroup.name}
                    />
                  ) : null
                )
              }
            />
          </div>
          <div className="sm:hidden">
            <Button
              label="Remover"
              color="red"
              onClick={() =>
                openModal(
                  user_id ? (
                    <RemoveUserFromGroupModal
                      userGroup={userGroup}
                      user_id={user_id}
                    />
                  ) : policy ? (
                    <DetachFromUserGroup
                      policy_id={policy.id}
                      user_group_id={userGroup.id}
                      user_group_name={userGroup.name}
                    />
                  ) : null
                )
              }
            />
          </div>
        </List.Item>
      ))}
    </React.Fragment>
  );
};

export default UserGroupsList;

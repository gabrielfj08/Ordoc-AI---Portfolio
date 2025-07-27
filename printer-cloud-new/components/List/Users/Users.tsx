import * as React from 'react';
import { Avatar, Button, List, Typography } from 'printer-ui';
import { UsersProps } from './types';
import { useModal } from '../../../hooks';
import RemoveUser from '../../Modal/UserGroup/RemoveUser/RemoveUser';
import DetachFromUser from '../../Modal/Policy/DetachFromUser';

const UsersList = ({ users, page, userGroup, policy }: UsersProps) => {
  const { openModal } = useModal();

  return (
    <React.Fragment key={page.nextId}>
      {users.map((user) => (
        <List.Item key={user.id} className="flex justify-between w-full">
          <div className="flex space-x-2 items-center truncate">
            <Avatar src={user.avatarUrl} placeholder={user.name.charAt(0)} />
            <div className="space-y-1 truncate max-w-[70%]">
              <Typography
                variant="footnote1"
                family="robotoMedium"
                className="truncate"
              >
                {user.name}
              </Typography>
              <Typography variant="caption" className="truncate">
                {user.email}
              </Typography>
            </div>
          </div>
          <div className="hidden sm:block">
            <Button
              label="Remover"
              color="error"
              onClick={() =>
                openModal(
                  userGroup ? (
                    <RemoveUser user={user} userGroup={userGroup} />
                  ) : policy ? (
                    <DetachFromUser
                      policy_id={policy.id}
                      user_id={user.id}
                      user_name={user.name}
                    />
                  ) : null
                )
              }
            />
          </div>
          <div className="sm:hidden">
            <Button
              size="sm"
              label="Remover"
              color="error"
              onClick={() =>
                openModal(
                  userGroup ? (
                    <RemoveUser user={user} userGroup={userGroup} />
                  ) : policy ? (
                    <DetachFromUser
                      policy_id={policy.id}
                      user_id={user.id}
                      user_name={user.name}
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

export default UsersList;

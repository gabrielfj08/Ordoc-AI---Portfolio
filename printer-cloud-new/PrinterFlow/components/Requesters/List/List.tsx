import * as React from 'react';
import { Avatar, Button, List, Typography } from 'printer-ui';
import { SessionGroupRequesterProvider, useModal } from '../../../../hooks';
import { RequestersListProps } from './types';
import RemoveRequesterModal from '../../../Groups/Modals/RemoveRequester';

const RequestersList = ({
  requesters,
  groupId,
  groupName,
  status,
  page,
}: RequestersListProps) => {
  const { openModal } = useModal();

  return (
    <React.Fragment key={page.nextId}>
      {requesters.map((requester) => (
        <List.Item key={requester.id} className="flex justify-between w-full">
          <div className="flex space-x-2 items-center truncate">
            <Avatar src="" placeholder={requester.name.charAt(0)} />
            <div className="space-y-1 truncate sm:max-w-[100%] max-w-[70%]">
              <Typography
                variant="footnote1"
                family="robotoMedium"
                className="truncate"
              >
                {requester.name}
              </Typography>
              <Typography variant="caption" className="truncate">
                {requester.email}
              </Typography>
            </div>
          </div>
          <div className="hidden sm:block">
            <Button
              label="Remover"
              color="error"
              disabled={status === 'inactive'}
              onClick={() =>
                openModal(
                  <SessionGroupRequesterProvider>
                    <RemoveRequesterModal
                      groupId={groupId}
                      groupName={groupName}
                      requesterId={requester.id}
                      requesterName={requester.name}
                    />
                  </SessionGroupRequesterProvider>
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
                  <SessionGroupRequesterProvider>
                    <RemoveRequesterModal
                      groupId={groupId}
                      groupName={groupName}
                      requesterId={requester.id}
                      requesterName={requester.name}
                    />
                  </SessionGroupRequesterProvider>
                )
              }
            />
          </div>
        </List.Item>
      ))}
    </React.Fragment>
  );
};

export default RequestersList;

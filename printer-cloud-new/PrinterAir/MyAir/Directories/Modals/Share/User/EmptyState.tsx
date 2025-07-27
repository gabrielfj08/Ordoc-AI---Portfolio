import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ShareDirectoryModalUserListItemEmptyStatus = () => {
  return (
    <div className="border border-lighterGray flex items-center space-x-2 justify-center py-4">
      <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
      <Typography variant="footnote1" color="gray" align="center">
        Esta pasta ainda não está compartilhada com nenhum usuário!
      </Typography>
    </div>
  );
};

export default ShareDirectoryModalUserListItemEmptyStatus;

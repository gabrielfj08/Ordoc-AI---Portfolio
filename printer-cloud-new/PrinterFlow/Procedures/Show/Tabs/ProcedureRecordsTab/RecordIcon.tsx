import * as React from 'react';
import { Icon } from 'printer-ui';

const RecordIcon = ({ action }) => {
  switch (action) {
    case 'create':
      return <Icon name="procedureDraft" alt="create" stroke w={35} h={35} />;
    case 'finish':
      return (
        <Icon name="procedureFinished" alt="finish" stroke w={35} h={35} />
      );
    case 'archive':
      return (
        <Icon name="archive" alt="archive" stroke w={35} h={35} color="error" />
      );
    case 'unarchive':
      return (
        <Icon
          name="unarchive"
          alt="unarchive"
          stroke
          w={35}
          h={35}
          color="success"
        />
      );
    default:
      return null;
  }
};

export default RecordIcon;

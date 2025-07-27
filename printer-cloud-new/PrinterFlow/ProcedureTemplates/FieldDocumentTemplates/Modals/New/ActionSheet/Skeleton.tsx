import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const NewFieldDocumentTemplateSkeleton = () => {
  return (
    <div className="rounded-lg bg-lighterGray  justify-between my-4 px-4 flex items-center w-full h-16">
      <span className="flex  items-center space-x-2">
        <Icon alt="zip" name="zipFileV2" stroke fill />
        <Typography variant="headline">Compactando arquivo</Typography>
      </span>
      <Icon
        name="loadingCircle"
        alt="loadingCircle"
        className="animate-spin"
        stroke
      />
    </div>
  );
};

export default NewFieldDocumentTemplateSkeleton;

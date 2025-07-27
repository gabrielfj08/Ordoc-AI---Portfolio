import * as React from 'react';
import { Disclosure } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { useActionSheet } from '../../../../../hooks';

const DocumentCopyJobsError = () => {
  const { closeActionSheet } = useActionSheet();

  return (
    <Disclosure defaultOpen={true}>
      {({ open }) => (
        <div className="bg-white border-2 border-lightGray rounded-lg p-5">
          <div className="flex items-center justify-between h-16">
            <Typography variant="headline" family="robotoMedium">
              Falha ao copiar arquivo
            </Typography>
            <div className="flex gap-2 h-fit">
              <button
                className="bg-gray rounded-full"
                onClick={() => {
                  closeActionSheet();
                }}
              >
                <Icon alt="close" name="close" color="white" stroke />
              </button>
            </div>
          </div>
        </div>
      )}
    </Disclosure>
  );
};

export default DocumentCopyJobsError;

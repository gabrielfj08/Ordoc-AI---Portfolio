import * as React from 'react';
import { Disclosure } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { useActionSheet } from '../../../../../hooks';
import { DocumentShareJobProps } from './types';
import DocumentShare from './DocumentShare';

const DocumentShareJob = ({ shareDocumentId }: DocumentShareJobProps) => {
  const { closeActionSheet } = useActionSheet();

  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <div className="bg-white border border-lighterGray p-5 rounded-lg">
          <div className="flex justify-between p-4 border-b border-lighterGray">
            <Typography variant="headline" family="robotoMedium">
              Compartilhando
            </Typography>
            <div className="flex space-x-4">
              <Disclosure.Button as={React.Fragment}>
                {open ? (
                  <button className="h-7 w-7 flex items-center justify-center bg-lightGray rounded-full">
                    <Icon alt="minus" name="minus" fill h={18} w={18} />
                  </button>
                ) : (
                  <button className="h-7 w-7 flex items-center justify-center bg-lightGray rounded-full">
                    <Icon alt="plus" name="plus" w={24} h={24} stroke />
                  </button>
                )}
              </Disclosure.Button>
              <button
                className="h-7 w-7 flex items-center justify-center bg-lightGray rounded-full"
                onClick={() => {
                  closeActionSheet();
                }}
              >
                <Icon alt="close" name="close" stroke />
              </button>
            </div>
          </div>
          <hr />
          <Disclosure.Panel unmount={false}>
            <span>
              <DocumentShare shareDocumentId={shareDocumentId} />
            </span>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};

export default DocumentShareJob;

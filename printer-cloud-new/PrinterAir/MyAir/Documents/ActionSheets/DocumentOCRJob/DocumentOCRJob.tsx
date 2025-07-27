import * as React from 'react';
import { Disclosure } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { useActionSheet } from '../../../../../hooks';
import { DocumentOCRJobProps } from './types';
import DocumentOCR from './DocumentOCR';

const DocumentOCRJob = ({ batchOperationId }: DocumentOCRJobProps) => {
  const { closeActionSheet } = useActionSheet();

  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <div className="border border-lightGray p-5 rounded-2xl bg-white">
          <div className="flex justify-between p-4 border-b border-lightGray">
            <Typography variant="headline" family="robotoMedium">
              OCR
            </Typography>
            <span className="flex space-x-4">
              <Disclosure.Button as={React.Fragment}>
                {open ? (
                  <button className="h-7 w-7 flex items-center justify-center bg-lightGray rounded-full">
                    <Icon alt="minus" name="minus" fill h={18} w={18} />
                  </button>
                ) : (
                  <button className="h-7 w-7 flex items-center justify-center bg-lightGray rounded-full">
                    <Icon alt="plus" name="plus" stroke h={24} w={24} />
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
            </span>
          </div>
          <Disclosure.Panel unmount={false}>
            <DocumentOCR batchOperationId={batchOperationId} />
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};

export default DocumentOCRJob;

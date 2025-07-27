import * as React from 'react';
import { Disclosure } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { useActionSheet } from '../../../../../hooks';
import { DocumentCopyJobsProps } from './types';
import DocumentCopyJob from '../../../DocumentCopyJobs/DocumentCopyJob';

const DocumentCopyJobs = ({
  document,
  documentCopy,
}: DocumentCopyJobsProps) => {
  const { closeActionSheet } = useActionSheet();

  return (
    <Disclosure defaultOpen={true}>
      {({ open }) => (
        <div className="bg-white border-2 border-lightGray rounded-lg p-5">
          <div className="flex items-center justify-between h-16">
            <Typography variant="headline" family="robotoMedium">
              Cópia de arquivo
            </Typography>
            <div className="flex gap-2 h-fit">
              <Disclosure.Button as={React.Fragment}>
                {open ? (
                  <button className="bg-gray rounded-full h-8 w-8">
                    <Typography variant="title1" color="white" align="center">
                      –
                    </Typography>
                  </button>
                ) : (
                  <button className="bg-gray rounded-full">
                    <Icon alt="plus" name="plus" color="white" stroke />
                  </button>
                )}
              </Disclosure.Button>
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
          <hr />
          <Disclosure.Panel>
            <div className="flex flex-col gap-4 pt-5 max-h-[50vh] overflow-y-auto">
              <DocumentCopyJob
                document={document}
                documentCopy={documentCopy}
              />
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};

export default DocumentCopyJobs;

import * as React from 'react';
import { Disclosure } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { useActionSheet } from '../../../../../hooks';
import { ProcedureTemplateActionSheetProps } from './types';
import UploadDocument from '../UploadDocument';

const ProcedureTemplateActionSheet = ({
  documentUploadIds,
}: ProcedureTemplateActionSheetProps) => {
  const { closeActionSheet } = useActionSheet();

  return (
    <Disclosure defaultOpen={true}>
      {({ open }) => (
        <div className="bg-white border-2 border-lightGray rounded-lg p-5">
          <div className="flex items-center justify-between h-16">
            <Typography variant="headline" family="robotoMedium">
              Envio de arquivos
            </Typography>
            <div className="flex gap-2 h-fit">
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
            </div>
          </div>
          <hr className="border-lightGray" />
          <Disclosure.Panel>
            <div className="flex flex-col gap-4 pt-5 max-h-[50vh] overflow-y-auto">
              {documentUploadIds.map((documentUploadId) => (
                <UploadDocument id={documentUploadId} key={documentUploadId} />
              ))}
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};

export default ProcedureTemplateActionSheet;

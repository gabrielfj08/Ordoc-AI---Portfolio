import * as React from 'react';
import { Disclosure } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { useActionSheet } from '../../../../../hooks';
import { CreateProcedurePDFActionSheetProps } from './types';
import NewProcedureReport from '../../NewProcedureReport';

const CreateProcedurePDFActionSheet = ({
  documentId,
  procedureId,
}: CreateProcedurePDFActionSheetProps) => {
  const { closeActionSheet } = useActionSheet();

  return (
    <Disclosure defaultOpen={true}>
      {({ open }) => (
        <div className="bg-white border-2 border-lightGray rounded-lg p-5">
          <div className="flex items-center justify-between h-16">
            <Typography variant="headline" family="robotoMedium">
              Gerador de PDF
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
              <NewProcedureReport
                documentId={documentId}
                procedureId={procedureId}
              />
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};

export default CreateProcedurePDFActionSheet;

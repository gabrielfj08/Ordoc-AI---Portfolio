import * as React from 'react';
import { Tab } from '@headlessui/react';
import { Button } from 'printer-ui';
import { useModal } from '../../../../../hooks';
import { SignaturesTabProps } from './types';
import SignatureProcedureFilterButton from './FilterSignatureProcedure';
import SignatureFilter from './Filter';
import Pagination from '../../../../../components/Pagination';
import DocumentSignaturesCard from '../../../../components/Signatures/Cards/DocumentCard';
import NewSignatureRequestersModal from '../../../../Signatures/Modals/SignatureRequesters';

const SignaturesTab = ({
  params,
  setParams,
  procedure,
}: SignaturesTabProps) => {
  const { openModal } = useModal();
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  const [totalObjects, setTotalObjects] = React.useState(0);

  return (
    <Tab.Panel
      className={classNames('rounded-lg p-1 flex h-full', 'focus:outline-none')}
    >
      <div className="space-y-4 px-2 pt-4 w-full h-fit">
        <div className="sm:flex sm:items-center justify-between space-x-4 space-y-4 sm:space-y-0">
          <div className="flex justify-between space-y-1 sm:space-y-0 sm:space-x-2">
            <div className="hidden sm:block">
              <Button
                label="Solicitar assinaturas"
                color="info"
                onClick={() => {
                  openModal(
                    <NewSignatureRequestersModal procedure={procedure} />
                  );
                }}
              >
                <Button.Icon
                  alt="signature"
                  name="signaturesV3"
                  color="white"
                  stroke
                  w={17}
                  h={17}
                />
              </Button>
            </div>
            <Button
              label="Solicitar assinaturas"
              color="info"
              size="sm"
              className="sm:hidden block"
              onClick={() => {
                openModal(
                  <NewSignatureRequestersModal procedure={procedure} />
                );
              }}
            >
              <Button.Icon
                alt="signature"
                name="signaturesV3"
                color="white"
                stroke
                w={17}
                h={17}
              />
            </Button>
            <SignatureProcedureFilterButton
              params={params}
              setParams={setParams}
            >
              <SignatureFilter />
            </SignatureProcedureFilterButton>
          </div>
          <div className="flex justify-end">
            <Pagination
              page={params.page}
              setPage={(page) => setParams({ ...params, page: page })}
              totalPages={Math.ceil(totalObjects / Number(params.perPage))}
              totalObjects={totalObjects}
              objectsPerPage={params.perPage}
            />
          </div>
        </div>
        <DocumentSignaturesCard
          setTotalObjects={setTotalObjects}
          params={params}
        />
      </div>
    </Tab.Panel>
  );
};

export default SignaturesTab;

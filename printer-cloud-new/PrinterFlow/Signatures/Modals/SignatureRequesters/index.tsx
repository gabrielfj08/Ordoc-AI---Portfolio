import * as React from 'react';
import router from 'next/router';
import { queryClient } from '../../../../queryClient';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { CreateSignaturePayload } from '../../../../services/printer-flow/types/signature';
import {
  ProcedureDocumentService,
  RequesterService,
  SignatureService,
  TaskDocumentService,
} from '../../../../services/printer-flow';
import { removeFileExtension } from '../../../../utils';
import {
  NewSignatureRequestersContainerModalProps,
  NewSignatureRequesterFormValues,
} from './types';
import NewSignatureRequestersModalSkeleton from './Skeleton';
import NewSignatureModal from './NewSignatureRequesters';
import NewSignatureRequestersModalError from './Error';

const NewSignatureRequestersModalContainer = ({
  procedure,
}: NewSignatureRequestersContainerModalProps) => {
  const { token, subdomain } = useAuth();

  const {
    isError: requestersIsError,
    isLoading: requestersIsLoading,
    data: requestersData,
  } = useQuery({
    queryKey: ['requesterSignature', token, subdomain, {}],
    queryFn: () =>
      RequesterService.index(token, subdomain, {
        perPage: 1000,
        order: 'name',
        direction: 'asc',
        status: 'active',
        type: 'InternalRequester',
      }),
  });

  const {
    isError: taskDocumentsIsError,
    isLoading: taskDocumentsIsLoading,
    data: taskDocumentsData,
  } = useQuery({
    queryKey: [
      'taskDocumentsSignature',
      token,
      subdomain,
      { procedureId: Number(router.query.procedureId) },
    ],
    queryFn: () =>
      TaskDocumentService.index(token, subdomain, {
        order: 'name',
        perPage: 1000,
        procedureId: Number(router.query.procedureId),
      }),
  });

  const {
    isError: procedureDocumentsIsError,
    isLoading: procedureDocumentsIsLoading,
    data: procedureDocumentsData,
  } = useQuery({
    queryKey: [
      'procedureDocumentsSignature',
      token,
      subdomain,
      { procedureId: Number(router.query.procedureId) },
    ],
    queryFn: () =>
      ProcedureDocumentService.index(
        token,
        subdomain,
        Number(router.query.procedureId),
        {}
      ),
  });

  const mutation = useMutation(
    (payload: CreateSignaturePayload) =>
      SignatureService.create(token, subdomain, {
        ...payload,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([]);
      },
    }
  );

  if (taskDocumentsIsError || requestersIsError || procedureDocumentsIsError)
    return <NewSignatureRequestersModalError />;

  if (
    taskDocumentsIsLoading ||
    requestersIsLoading ||
    procedureDocumentsIsLoading
  )
    return <NewSignatureRequestersModalSkeleton />;

  const handleSubmit = (values: NewSignatureRequesterFormValues) => {
    return mutation.mutateAsync(values);
  };

  const removeNotPDFFiles = (filesArray) =>
    filesArray.filter((item: any) => item.name.endsWith('.pdf'));

  const procedureDocumentsPDFOnly = removeNotPDFFiles(
    procedureDocumentsData.procedureDocuments
  );

  const taskDocumentsPDFOnly = removeNotPDFFiles(
    taskDocumentsData.taskDocuments
  );

  const mapFilesWithoutExtension = (filesArray) =>
    filesArray.map((item: any) => {
      return { label: removeFileExtension(item.name), value: item.id };
    });

  const mapRequestersList = (requestersArray) =>
    requestersArray.map((item: any) => {
      return { label: item.name, value: item.id };
    });

  return (
    <NewSignatureModal
      procedure={procedure}
      onSubmit={handleSubmit}
      procedureDocuments={mapFilesWithoutExtension(procedureDocumentsPDFOnly)}
      taskDocuments={mapFilesWithoutExtension(taskDocumentsPDFOnly)}
      requesters={mapRequestersList(requestersData.requesters)}
    />
  );
};

export default NewSignatureRequestersModalContainer;

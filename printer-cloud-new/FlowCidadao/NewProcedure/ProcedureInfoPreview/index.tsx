import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../hooks';
import { ExternalProcedureTemplateService } from '../../../services/flow-cidadao';
import { ProcedurePreviewContainerProps } from './types';
import ProcedureInfoPreview from './ProcedureInfoPreview';
import ProcedureInfoPreviewSkeleton from './Skeleton';
import ProcedureInfoPreviewError from './Error';

const ProcedureInfoPreviewContainer = ({
  formik,
  subjectId,
  procedureTemplateId,
}: ProcedurePreviewContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();

  const {
    isLoading: isLoadingProcedureTemplate,
    isError: isErrorProcedureTemplate,
    data: dataProcedureTemplate,
  } = useQuery({
    queryKey: ['showPreview', subdomain, externalToken, procedureTemplateId],
    queryFn: () =>
      ExternalProcedureTemplateService.show(
        externalToken as string,
        subdomain,
        procedureTemplateId
      ),
  });

  const {
    isLoading: isLoadingSubject,
    isError: isErrorSubject,
    data: dataSubject,
  } = useQuery({
    queryKey: ['showPreview', subdomain, externalToken, subjectId],
    queryFn: () =>
      ExternalProcedureTemplateService.show(
        externalToken as string,
        subdomain,
        subjectId
      ),
  });

  if (isLoadingProcedureTemplate || isLoadingSubject) {
    return <ProcedureInfoPreviewSkeleton />;
  }

  if (isErrorProcedureTemplate || isErrorSubject) {
    return <ProcedureInfoPreviewError />;
  }

  return (
    <ProcedureInfoPreview
      formik={formik}
      procedureTemplate={dataProcedureTemplate}
      subject={dataSubject}
    />
  );
};

export default ProcedureInfoPreviewContainer;

import * as React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { ProcedureTemplateService } from '../../../services/printer-flow';
import {
  BaseProcedureTemplate,
  CreateProcedureTemplatePayload,
} from '../../../services/printer-flow/types';
import {
  NewProcedureTemplateContainerProps,
  NewProcedureTemplateFormValues,
} from './types';
import NewProcedureTemplate from './New';

const NewProcedureTemplateContainer =
  ({}: NewProcedureTemplateContainerProps) => {
    const { subdomain, token } = useAuth();
    const queryClient = useQueryClient();

    const mutation = useMutation(
      (payload: CreateProcedureTemplatePayload) =>
        ProcedureTemplateService.create(token, subdomain, payload),
      {
        onSuccess: () => {
          queryClient.invalidateQueries([
            'procedureTemplates',
            subdomain,
            token,
            {},
          ]);
        },
      }
    );

    const transformSource = (source: Array<string>): string => {
      if (source.includes('internal') && source.includes('external')) {
        return 'internal_external';
      }

      if (source.includes('external')) {
        return 'external';
      }

      return 'internal';
    };

    const handleSubmit = (
      values: NewProcedureTemplateFormValues
    ): Promise<BaseProcedureTemplate> => {
      return mutation.mutateAsync({
        ...values,
        source: transformSource(values.source),
      });
    };

    return <NewProcedureTemplate onSubmit={handleSubmit} />;
  };

export default NewProcedureTemplateContainer;

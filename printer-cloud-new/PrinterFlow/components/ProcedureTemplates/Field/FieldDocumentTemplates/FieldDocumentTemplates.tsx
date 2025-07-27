import * as React from 'react';
import { Formik, Form } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Typography, Button, Icon } from 'printer-ui';
import { useAuth, useSnackbar } from '../../../../../hooks';
import { FieldService } from '../../../../../services/printer-flow';
import {
  FieldDocumentTemplatesProps,
  FieldDocumentTemplateFormValues,
} from './types';
import FieldDocumentTemplateSelect from '../../../FieldDocumentTemplate/Select';

const FieldDocumentTemplates = ({
  type,
  setType,
  fieldId,
  procedureTemplateId,
  fieldDocumentTemplate,
  onSubmit,
}: FieldDocumentTemplatesProps) => {
  const { subdomain, token } = useAuth();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const documentTemplate: any = {
    show: (
      <div className="w-full space-y-2">
        <div>
          <Typography variant="footnote1" family="robotoMedium">
            Modelo de anexo do campo:
          </Typography>
        </div>
        <div>
          <Typography
            variant="footnote1"
            family="roboto"
            className="truncate w-full"
          >
            {fieldDocumentTemplate?.name}
          </Typography>
        </div>
      </div>
    ),
    edit: (
      <div className="w-full space-y-2">
        <div>
          <Typography variant="footnote1" family="robotoMedium">
            Modelo de anexo do campo:
          </Typography>
        </div>
        <div>
          <Typography
            variant="footnote1"
            family="roboto"
            className="truncate w-full"
          >
            {fieldDocumentTemplate?.name}
          </Typography>
        </div>
      </div>
    ),
    openFieldDocumentTemplate: (
      <Formik
        initialValues={
          {
            fieldDocumentTemplateId: fieldDocumentTemplate?.id,
          } as FieldDocumentTemplateFormValues
        }
        onSubmit={(values: FieldDocumentTemplateFormValues) => {
          onSubmit(values)
            .then(() => {
              showSnackbar(
                'Modelo de anexo adicionado com sucesso.',
                'success'
              );
            })
            .catch((error) => {
              showSnackbar(error.response.data.message, 'error');
            });
        }}
      >
        {(formik) => (
          <Form>
            <div className="w-full space-y-2">
              <div>
                <Typography variant="footnote1" family="robotoMedium">
                  Modelo de anexo do campo:
                </Typography>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-11/12">
                  <FieldDocumentTemplateSelect
                    name="fieldDocumentTemplateId"
                    fieldDocumentTemplate={fieldDocumentTemplate}
                  />
                </div>
                <div
                  id={`detachDocumentTemplate-${fieldDocumentTemplate?.id}`}
                  data-tooltip-content="Remover modelo de anexo do campo"
                >
                  <button
                    type="button"
                    disabled={fieldDocumentTemplate?.id ? false : true}
                    onClick={() =>
                      FieldService.detachDocumentTemplate(
                        token,
                        subdomain,
                        fieldId,
                        {
                          fieldDocumentTemplateId: fieldDocumentTemplate.id,
                        }
                      )
                        .then(() => {
                          showSnackbar(
                            `Modelo de anexo removido do campo com sucesso.`,
                            'success'
                          );
                          queryClient.invalidateQueries([
                            'fields',
                            subdomain,
                            token,
                            procedureTemplateId,
                            {},
                          ]);
                        })
                        .catch((error) => {
                          showSnackbar(error.response.data.message, 'error');
                        })
                    }
                  >
                    <Icon
                      name="trashV2"
                      alt="excluir"
                      color={fieldDocumentTemplate?.id ? 'error' : 'lightGray'}
                      w={25}
                      h={25}
                      fill
                      stroke
                    />
                  </button>
                  <ReactTooltip
                    anchorId={`detachDocumentTemplate-${fieldDocumentTemplate?.id}`}
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-2 justify-between mt-5">
              <Button
                type="button"
                label="Cancelar"
                color="error"
                onClick={() => {
                  setType('show');
                }}
              />
              <Button
                type="submit"
                label="Salvar alterações"
                color="info"
                className="truncate"
                disabled={formik.isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    ),
  };

  return <div>{documentTemplate[type]}</div>;
};

export default FieldDocumentTemplates;

import * as React from 'react';
import { Input, Typography } from 'printer-ui';
import { ShowProcedureTemplateProps } from './types';
import Accordion from '../../../components/Accordion';
import ShowProcedureTemplateDocument from './ProcedureTemplateDocument';
import ShowProcedureTemplateField from './ProcedureTemplateField';
import ShowProcedureTemplateSubject from './Subject';

const ShowProcedureTemplate = ({
  procedureTemplate,
  procedureTemplateDocument,
}: ShowProcedureTemplateProps) => {
  return (
    <div className="w-full mb-12">
      <div className="w-full mt-4 sm:w-6/12 space-y-8 px-4">
        <div className="space-y-2">
          <Typography variant="footnote1" family="robotoMedium">
            Nome do tipo de processo*:
          </Typography>
          <Input
            w="full"
            size="md"
            type="text"
            name="name"
            onChange={() => {}}
            value={procedureTemplate.name}
            disabled
          />
        </div>
        <div className="space-y-2">
          <Typography
            variant="footnote1"
            family="robotoMedium"
            className="py-4"
          >
            Visualização do tipo de processo*:
          </Typography>
          <div className="flex space-x-6 pb-4">
            <div className="flex space-x-2">
              <input
                type="checkbox"
                id="internal"
                name="internal"
                checked={procedureTemplate?.source.includes('internal')}
                disabled
              />
              <Typography
                variant="footnote1"
                family="robotoMedium"
                className="space-x-2"
                color="gray"
              >
                Interno
              </Typography>
            </div>
            <div className="flex space-x-2">
              <input
                type="checkbox"
                id="external"
                name="external"
                checked={procedureTemplate.source.includes('external')}
                disabled
              />
              <Typography
                variant="footnote1"
                color="gray"
                family="robotoMedium"
              >
                Externo
              </Typography>
            </div>
          </div>
        </div>
        <div className="w-full">
          <Accordion
            defaultOpen={false}
            items={[
              {
                label: 'Anexos do tipo de processo',
                content: (
                  <ShowProcedureTemplateDocument
                    procedureTemplateDocument={procedureTemplateDocument}
                    procedureTemplate={procedureTemplate}
                  />
                ),
              },
              {
                label: 'Campos do tipo de processo',
                content: (
                  <ShowProcedureTemplateField
                    procedureTemplate={procedureTemplate}
                  />
                ),
              },
              {
                label: 'Assuntos do tipo de processo',
                content: (
                  <ShowProcedureTemplateSubject
                    procedureTemplate={procedureTemplate}
                  />
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowProcedureTemplate;

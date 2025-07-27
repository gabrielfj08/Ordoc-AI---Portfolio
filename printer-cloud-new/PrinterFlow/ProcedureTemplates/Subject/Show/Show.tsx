import * as React from 'react';
import { Typography } from 'printer-ui';
import { ShowSubjectProps } from './types';
import Accordion from '../../../../components/Accordion';
import ShowSubjectDocumentContainer from './AttachmentDocument';
import ShowFieldSubjectContainer from './SubjectField';

const ShowSubject = ({
  procedureTemplateDocument,
  procedureTemplate,
}: ShowSubjectProps) => {
  return (
    <div className="w-full mb-12">
      <div className="mt-4 sm:w-6/12 w-full px-4">
        <Typography variant="footnote1" family="robotoMedium" className="py-2">
          Nome do assunto:*
        </Typography>
        <Typography variant="footnote1" className="py-2 pb-4">
          {procedureTemplate.name}
        </Typography>
        <Typography variant="footnote1" family="robotoMedium" className="py-2">
          Grupo responsável:{procedureTemplate.source !== 'internal' && '*'}
        </Typography>
        {procedureTemplate.groupRequester ? (
          <Typography variant="footnote1" className="py-2 pb-4">
            {procedureTemplate.groupRequester.name}
          </Typography>
        ) : (
          <Typography variant="footnote1" color="gray" className="italic">
            Sem grupo responsável definido
          </Typography>
        )}
        <Typography variant="footnote1" family="robotoMedium" className="py-4">
          Visualização de assunto:
        </Typography>
        <div className="flex space-x-6 pb-4">
          <div className="flex space-x-2">
            <input
              type="checkbox"
              id="internal"
              name="internal"
              checked={procedureTemplate.source.includes('internal')}
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
            <Typography variant="footnote1" color="gray" family="robotoMedium">
              Externo
            </Typography>
          </div>
        </div>
      </div>
      <div className="w-full sm:w-7/12 sm:pl-1 sm:pr-24">
        <Accordion
          items={[
            {
              label: 'Campos de assunto',
              content: (
                <ShowFieldSubjectContainer
                  procedureTemplate={procedureTemplate}
                />
              ),
            },
          ]}
          defaultOpen={false}
        />
        <Accordion
          items={[
            {
              label: 'Anexos do assunto',
              content: (
                <ShowSubjectDocumentContainer
                  procedureTemplate={procedureTemplate}
                  procedureTemplateDocument={procedureTemplateDocument}
                />
              ),
            },
          ]}
          defaultOpen={false}
        />
      </div>
    </div>
  );
};

export default ShowSubject;

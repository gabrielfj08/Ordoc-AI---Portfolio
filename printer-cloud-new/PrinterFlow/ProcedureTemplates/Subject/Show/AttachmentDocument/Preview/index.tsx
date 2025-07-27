import * as React from 'react';
import { SubjectPreviewDocumentContainerProps } from './types';
import SubjectPreviewDocument from './Preview';

const SubjectPreviewDocumentContainer = ({
  procedureTemplateDocument,
}: SubjectPreviewDocumentContainerProps) => {
  return (
    <SubjectPreviewDocument
      procedureTemplateDocument={procedureTemplateDocument}
    />
  );
};

export default SubjectPreviewDocumentContainer;

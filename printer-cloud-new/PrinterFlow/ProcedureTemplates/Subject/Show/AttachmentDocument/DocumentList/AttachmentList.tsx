import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon, List, Typography } from 'printer-ui';
import { useModal } from '../../../../../../hooks';
import { removeFileExtension } from '../../../../../../utils';
import { SubjectDocumentListProps } from './types';
import SubjectPreviewDocumentContainer from '../Preview';
import SubjectMenuButtonList from './MenuButton';

const SubjectDocumentList = ({
  procedureTemplate,
  procedureTemplateDocuments,
}: SubjectDocumentListProps) => {
  const { openModal } = useModal();

  return (
    <div className="pt-4">
      <React.Fragment>
        {procedureTemplateDocuments.map((procedureTemplateDocument) => (
          <List.Item
            key={procedureTemplateDocument.id}
            className="flex sm:w-full w-80 justify-between space-x-2 border border-lightGray bg-white "
          >
            <div
              id={`attachmentName${procedureTemplateDocument.id}`}
              data-tooltip-content={removeFileExtension(
                procedureTemplateDocument.name
              )}
              className="flex space-x-2 items-center truncate w-full cursor-pointer"
              onClick={() =>
                openModal(
                  <SubjectPreviewDocumentContainer
                    procedureTemplateDocument={procedureTemplateDocument}
                  />
                )
              }
            >
              <ReactTooltip
                anchorId={`attachmentName${procedureTemplateDocument.id}`}
              />
              <div className="space-x-2 flex items-center truncate sm:w-full w-80">
                <Icon
                  alt="fileV2"
                  name="fileV2"
                  fill
                  bgColor="lighterGray"
                  bgStyle="rounded"
                />
                <Typography
                  variant="footnote1"
                  family="robotoMedium"
                  className="truncate"
                >
                  {removeFileExtension(procedureTemplateDocument.name)}
                </Typography>
              </div>
            </div>
            <div
              className={
                procedureTemplate.status === 'inactive' ? 'hidden' : 'flex'
              }
            >
              <SubjectMenuButtonList
                procedureTemplateDocument={procedureTemplateDocument}
              />
            </div>
          </List.Item>
        ))}
      </React.Fragment>
    </div>
  );
};

export default SubjectDocumentList;

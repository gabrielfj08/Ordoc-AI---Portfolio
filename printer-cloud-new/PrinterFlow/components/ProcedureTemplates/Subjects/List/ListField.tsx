import * as React from 'react';
import router from 'next/router';
import { Icon, List, Typography } from 'printer-ui';
import { SubjectsListFieldProps } from './types';
import MenuButtonList from './MenuButtonList';

const SubjectsListField = ({
  subjects,
  procedureTemplate,
}: SubjectsListFieldProps) => {
  return (
    <React.Fragment>
      {subjects.map((subject) => (
        <List.Item
          className="flex w-full justify-between space-x-2 border border-lightGray bg-white"
          key={subject.id}
        >
          <div
            className="flex items-center space-x-2 truncate w-full cursor-pointer"
            onClick={() =>
              router.push(
                `/printer-flow/procedure-templates/${router.query.procedureTemplateId}/subjects/${subject.id}`
              )
            }
          >
            <Icon
              alt="procedure"
              name="procedureTemplateV3"
              fill
              stroke
              w={30}
              h={30}
              color={subject.status === 'active' ? 'success' : 'error'}
              bgColor="lighterGray"
              bgStyle="rounded"
            />
            <Typography
              variant="footnote1"
              family="robotoMedium"
              className="truncate"
            >
              {subject.name}
            </Typography>
          </div>
          <div
            className={
              procedureTemplate.status === 'inactive' ? 'hidden' : 'flex'
            }
          >
            <MenuButtonList procedureTemplate={subject} />
          </div>
        </List.Item>
      ))}
    </React.Fragment>
  );
};

export default SubjectsListField;

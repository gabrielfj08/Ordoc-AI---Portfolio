import * as React from 'react';
import { Typography, Icon } from 'printer-ui';
import { iconTaskFieldType, transformTaskFieldType } from '../../../utils';
import { ShowTaskFieldProps } from './types';
import TaskFieldsMenuButton from '../MenuButton';

const ShowTaskField = ({
  taskField,
  taskTemplate,
  type,
  setType,
}: ShowTaskFieldProps) => {
  return (
    <div className="shadow-default w-full h-fit bg-white px-4 pt-4 pb-8 rounded-2xl border border-lightGray">
      <div
        className={
          type === 'edit' || taskTemplate.status === 'inactive'
            ? 'hidden'
            : 'w-full justify-end flex'
        }
      >
        <TaskFieldsMenuButton
          taskField={taskField}
          taskTemplate={taskTemplate}
          setType={setType}
        />
      </div>
      <div className="space-y-8">
        <div className="space-y-2 mt-2 w-full">
          <div>
            <Typography
              variant="footnote1"
              family="robotoMedium"
              className="truncate w-full"
            >
              Título do campo:
            </Typography>
          </div>
          <div className="w-full">
            <Typography
              variant="footnote1"
              family="roboto"
              className="truncate w-11/12"
            >
              {taskField.label}
            </Typography>
          </div>
        </div>
        <div className="w-full space-y-2">
          <div>
            <Typography variant="footnote1" family="robotoMedium">
              Tipo do campo:
            </Typography>
          </div>
          <div className="w-full flex items-center space-x-1">
            <Icon
              name={iconTaskFieldType(taskField.fieldType)}
              alt={iconTaskFieldType(taskField.fieldType)}
              stroke={taskField.fieldType === 'cnpj' ? false : true}
              fill={taskField.fieldType === 'cnpj' ? true : false}
              w={26}
              h={26}
            />
            <Typography
              variant="footnote1"
              family="roboto"
              className="truncate w-full"
            >
              {transformTaskFieldType(taskField.fieldType)}
            </Typography>
          </div>
        </div>
        {(taskField.fieldType === 'checkbox' ||
          taskField.fieldType === 'select_field') && (
          <div className="space-y-2 mt-2 w-full">
            <div>
              <Typography
                variant="footnote1"
                family="robotoMedium"
                className="truncate w-full"
              >
                Opções do campo:
              </Typography>
            </div>
            {taskField.options.map((option) => (
              <div key={option} className="w-11/12 truncate space-y-0.5">
                <Typography
                  variant="footnote1"
                  family="roboto"
                  className="truncate"
                >
                  {option}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowTaskField;

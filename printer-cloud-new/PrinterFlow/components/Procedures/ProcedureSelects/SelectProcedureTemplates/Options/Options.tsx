import * as React from 'react';
import { Combobox } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { SelectProcedureTemplateOptionsProps } from './types';
import ProcedureTemplateSelectOptionsEmpty from './Empty';

const SelectProcedureTemplateOptions = ({
  procedureTemplates,
}: SelectProcedureTemplateOptionsProps) => {
  return (
    <Combobox.Options>
      {procedureTemplates.length <= 0 ? (
        <ProcedureTemplateSelectOptionsEmpty />
      ) : (
        procedureTemplates.map((procedureTemplate) => {
          return (
            <Combobox.Option
              key={procedureTemplate.id}
              value={procedureTemplate}
              className={({ active }) =>
                `relative py-1.5 pl-3 pr-4 ${
                  active ? 'bg-blue/5 text-black' : 'text-gray-900'
                }`
              }
            >
              <div className="flex items-center">
                <Icon
                  alt="procedureTemplate"
                  name={
                    procedureTemplate.source === 'external'
                      ? 'external'
                      : procedureTemplate.source === 'internal'
                      ? 'internal'
                      : procedureTemplate.source === 'internal_external'
                      ? 'internalExternal'
                      : 'internal'
                  }
                  color={
                    procedureTemplate.source === 'external'
                      ? 'orange'
                      : procedureTemplate.source === 'internal'
                      ? 'black'
                      : procedureTemplate.source === 'internal_external'
                      ? 'orange'
                      : 'black'
                  }
                  fill
                  stroke
                  w={28}
                  h={28}
                />
                <Typography variant="footnote1" className="px-4">
                  {procedureTemplate.name}
                </Typography>
              </div>
            </Combobox.Option>
          );
        })
      )}
    </Combobox.Options>
  );
};

export default SelectProcedureTemplateOptions;

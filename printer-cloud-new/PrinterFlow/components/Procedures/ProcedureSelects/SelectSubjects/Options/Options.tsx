import * as React from 'react';
import { Combobox } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { SelectSubjectsOptionsProps } from './types';
import SubjectSelectOptionsEmpty from './Empty';

const SelectSubjectsOptions = ({ subjects }: SelectSubjectsOptionsProps) => {
  return (
    <Combobox.Options>
      {subjects.length <= 0 ? (
        <SubjectSelectOptionsEmpty />
      ) : (
        subjects.map((subject) => {
          return (
            <Combobox.Option
              key={subject.id}
              value={subject}
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
                    subject.source === 'external'
                      ? 'external'
                      : subject.source === 'internal'
                      ? 'internal'
                      : subject.source === 'internal_external'
                      ? 'internalExternal'
                      : 'internal'
                  }
                  color={
                    subject.source === 'external'
                      ? 'orange'
                      : subject.source === 'internal'
                      ? 'black'
                      : 'black'
                  }
                  fill
                  stroke
                  w={28}
                  h={28}
                />
                <Typography variant="footnote1" className="px-4">
                  {subject.name}
                </Typography>
              </div>
            </Combobox.Option>
          );
        })
      )}
    </Combobox.Options>
  );
};

export default SelectSubjectsOptions;

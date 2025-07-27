import * as React from 'react';
import { Combobox } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { iconTaskFieldType } from '../../../../utils';
import { SelectFieldTypeOptionsProps } from './types';
import SelectFieldTypeOptionsEmpty from './Empty';

const SelectFieldTypeOptions = ({ fieldType }: SelectFieldTypeOptionsProps) => {
  return (
    <Combobox.Options>
      {fieldType.length <= 0 ? (
        <SelectFieldTypeOptionsEmpty />
      ) : (
        fieldType.map((field) => {
          return (
            <Combobox.Option
              key={field.value}
              value={field}
              className={({ active }) =>
                `relative py-2 pl-3 pr-4 ${
                  active ? 'bg-blue/5 text-black' : 'text-gray-900'
                }`
              }
            >
              <div className="flex items-center space-x-2">
                <Icon
                  alt="fieldType"
                  name={iconTaskFieldType(field.value)}
                  stroke={field.value === 'cnpj' ? false : true}
                  fill={field.value === 'cnpj' ? true : false}
                  w={28}
                  h={28}
                />
                <Typography variant="footnote1">{field.name}</Typography>
              </div>
            </Combobox.Option>
          );
        })
      )}
    </Combobox.Options>
  );
};

export default SelectFieldTypeOptions;

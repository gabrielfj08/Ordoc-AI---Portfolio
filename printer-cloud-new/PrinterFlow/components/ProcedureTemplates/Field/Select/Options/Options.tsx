import * as React from 'react';
import { Combobox } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { iconFieldType } from '../../../../../utils';
import { SelectNewFieldTypeValuesOptionsProps } from './types';
import NewFieldTypeValuesSelectEmpty from './Empty';

const SelectNewFieldTypeValuesOptions = ({
  fieldType,
}: SelectNewFieldTypeValuesOptionsProps) => {
  return (
    <Combobox.Options>
      {fieldType.length <= 0 ? (
        <NewFieldTypeValuesSelectEmpty />
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
                  name={iconFieldType(field.value)}
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

export default SelectNewFieldTypeValuesOptions;

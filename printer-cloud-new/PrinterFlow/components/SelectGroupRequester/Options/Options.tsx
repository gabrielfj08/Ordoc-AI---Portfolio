import * as React from 'react';
import { Combobox } from '@headlessui/react';
import { SelectGroupRequestersOptionsProps } from './types';
import GroupRequestersSelectEmpty from './Empty';

const SelectGroupRequestersOptions = ({
  groupRequester,
}: SelectGroupRequestersOptionsProps) => {
  return (
    <Combobox.Options>
      {groupRequester.length <= 0 ? (
        <GroupRequestersSelectEmpty />
      ) : (
        groupRequester.map((groupRequester) => {
          return (
            <Combobox.Option
              key={groupRequester.id}
              value={groupRequester}
              className={({ active }) =>
                `relative py-2 pl-3 pr-4 ${
                  active ? 'bg-blue/5 text-black' : 'text-gray-900'
                }`
              }
            >
              {groupRequester.name}
            </Combobox.Option>
          );
        })
      )}
    </Combobox.Options>
  );
};

export default SelectGroupRequestersOptions;

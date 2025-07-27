import * as React from 'react';
import { Combobox } from '@headlessui/react';

import { SelectUserOptionsProps } from './types';
import SelectUserOptionsEmpty from './Empty';

const SelectUserOptions = ({ users }: SelectUserOptionsProps) => {
  return (
    <Combobox.Options>
      {users.length <= 0 ? (
        <SelectUserOptionsEmpty />
      ) : (
        users.map((user) => {
          return (
            <Combobox.Option
              key={user.id}
              value={user}
              className={({ active }) =>
                `relative py-2 pl-3 pr-4 ${
                  active ? 'bg-blue text-white' : 'text-gray-900'
                }`
              }
            >
              {user.username}
            </Combobox.Option>
          );
        })
      )}
    </Combobox.Options>
  );
};

export default SelectUserOptions;

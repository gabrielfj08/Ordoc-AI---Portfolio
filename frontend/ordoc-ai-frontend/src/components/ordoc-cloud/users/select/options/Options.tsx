import React from 'react';
import { Combobox } from '@headlessui/react';
import { SelectUserOptionsProps, User } from '@/components/ordoc-cloud/users/select/options/types';
import UserSelectEmpty from '@/components/ordoc-cloud/users/select/options/Empty';

const SelectUserOptions = ({ users }: SelectUserOptionsProps) => {
  return (
    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
      {users.length <= 0 ? (
        <UserSelectEmpty />
      ) : (
        users.map((user: User) => {
          return (
            <Combobox.Option
              key={user.id}
              value={user}
              className={({ active }: { active: boolean }) =>
                `relative cursor-default select-none py-2 pl-3 pr-4 ${
                  active ? 'bg-blue-600 text-white' : 'text-gray-900'
                }`
              }
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                  {user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : user.email[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{user.name || user.email}</div>
                  {user.name && (
                    <div className="text-sm text-gray-500">{user.email}</div>
                  )}
                </div>
              </div>
            </Combobox.Option>
          );
        })
      )}
    </Combobox.Options>
  );
};

export default SelectUserOptions;

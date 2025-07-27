import * as React from 'react';
import { Combobox } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { SelectGroupRequestersOptionsProps } from './types';
import GroupRequesterTaskSelectOptionsEmpty from './Empty';

const SelectGroupRequestersOptions = ({
  groupRequesters,
}: SelectGroupRequestersOptionsProps) => {
  return (
    <Combobox.Options className="max-h-24">
      {groupRequesters.length <= 0 ? (
        <GroupRequesterTaskSelectOptionsEmpty />
      ) : (
        groupRequesters.map((groupRequester) => {
          return (
            <Combobox.Option
              key={groupRequester.id}
              value={groupRequester}
              className={({ active }) =>
                `relative py-1.5 pl-3 pr-4 ${
                  active ? 'bg-blue/5 text-black' : 'text-gray-900'
                }`
              }
            >
              <div className="flex items-center">
                <Icon
                  alt="requester"
                  name="search"
                  color="gray"
                  stroke
                  w={28}
                  h={28}
                />
                <Typography variant="footnote1" className="px-4">
                  {groupRequester.name}
                </Typography>
              </div>
            </Combobox.Option>
          );
        })
      )}
    </Combobox.Options>
  );
};

export default SelectGroupRequestersOptions;

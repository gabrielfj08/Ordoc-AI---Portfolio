import * as React from 'react';
import { Combobox } from '@headlessui/react';
import { SelectAddRequestersOptionsProps } from './types';
import AddRequestersSelectEmpty from './Empty';

const SelectAddRequestersOptions = ({
  requesters,
  requestersFromGroup,
}: SelectAddRequestersOptionsProps) => {
  const addRequesters = requesters.filter(
    (requester: { id: number }) =>
      !requestersFromGroup
        .map((requesterFromGroup: { id: number }) => requesterFromGroup.id)
        .includes(requester.id)
  );

  return (
    <Combobox.Options>
      {addRequesters.length <= 0 ? (
        <AddRequestersSelectEmpty />
      ) : (
        addRequesters.map((requester) => {
          return (
            <Combobox.Option
              key={requester.id}
              value={requester}
              className={({ active }) =>
                `relative py-2 pl-3 pr-4 ${
                  active ? 'bg-blue/5 text-black' : 'text-gray-900'
                }`
              }
            >
              {requester.name}
            </Combobox.Option>
          );
        })
      )}
    </Combobox.Options>
  );
};

export default SelectAddRequestersOptions;

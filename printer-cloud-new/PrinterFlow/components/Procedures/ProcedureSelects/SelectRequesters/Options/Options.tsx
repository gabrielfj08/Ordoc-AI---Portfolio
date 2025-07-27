import * as React from 'react';
import { Combobox } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { SelectRequesterOptionsProps } from './types';
import { getRequesterType } from '../../../../../../utils/getRequesterType';
import RequesterSelectOptionsEmpty from './Empty';

const SelectRequesterOptions = ({
  requesters,
}: SelectRequesterOptionsProps) => {
  return (
    <Combobox.Options>
      {requesters.length <= 0 ? (
        <RequesterSelectOptionsEmpty />
      ) : (
        requesters.map((requester) => {
          return (
            <Combobox.Option
              key={requester.id}
              value={requester}
              className={({ active }) =>
                `relative py-1.5 pl-3 pr-4 ${
                  active ? 'bg-blue/5 text-black' : 'text-gray-900'
                }`
              }
            >
              <div className="flex items-center">
                <Icon
                  alt="requester"
                  name={
                    getRequesterType(requester.type) === 'ExternalRequester'
                      ? 'external'
                      : requester.type === 'InternalRequester'
                      ? 'internal'
                      : 'internal'
                  }
                  color={
                    getRequesterType(requester.type) === 'ExternalRequester'
                      ? 'orange'
                      : requester.type === 'InternalRequester'
                      ? 'black'
                      : 'black'
                  }
                  fill
                  stroke
                  w={28}
                  h={28}
                />
                <Typography variant="footnote1" className="px-4">
                  {requester.name}
                </Typography>
              </div>
            </Combobox.Option>
          );
        })
      )}
    </Combobox.Options>
  );
};

export default SelectRequesterOptions;

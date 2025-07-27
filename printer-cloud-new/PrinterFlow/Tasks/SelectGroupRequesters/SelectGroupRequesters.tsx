import * as React from 'react';
import { useField } from 'formik';
import { Combobox } from '@headlessui/react';
import { Icon } from 'printer-ui';
import { SelectGroupRequestersProps } from './types';
import SelectTaskGroupRequesterOptions from './Options';
import SelectGroupRequestersOptionsError from './Options/Error';

const SelectGroupRequesters = ({
  name,
  groupRequester,
}: SelectGroupRequestersProps) => {
  const [_field, _meta, helpers] = useField({ name });
  const [query, setQuery] = React.useState<string>('');
  const [isError, setIsError] = React.useState<boolean>(false);

  if (isError) return <SelectGroupRequestersOptionsError />;

  return (
    <Combobox
      onChange={(value: any) => {
        helpers.setValue(value.id);
      }}
    >
      {({ open }) => (
        <div className="relative">
          <Combobox.Button className="relative w-full rounded-lg bg-white">
            <Combobox.Input
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              displayValue={(groupRequester: any) => groupRequester?.name}
              placeholder={groupRequester?.name}
              className="w-full py-1.5 px-10 rounded-md border"
            />
            <div className="absolute w-full justify-between inset-y-0 right-0 flex items-center p-2">
              <Icon
                alt="search"
                name="search"
                color="gray"
                stroke
                w={24}
                h={24}
              />
              <div className="h-5 w-5 flex justify-between" aria-hidden="true">
                <Icon
                  name={open ? 'up' : 'down'}
                  alt="down"
                  color="gray"
                  stroke
                  w={20}
                  h={20}
                />
              </div>
            </div>
          </Combobox.Button>
          <SelectTaskGroupRequesterOptions
            setError={setIsError}
            query={query}
            open={open}
          />
        </div>
      )}
    </Combobox>
  );
};

export default SelectGroupRequesters;

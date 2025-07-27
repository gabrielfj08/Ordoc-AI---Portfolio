import * as React from 'react';
import { useField } from 'formik';
import { Combobox } from '@headlessui/react';
import { Icon } from 'printer-ui';
import { AddRequestersSelectProps } from './types';
import AddRequestersSelectOptions from './Options';

const AddRequestersSelect = ({ name, groupId }: AddRequestersSelectProps) => {
  const [_field, _meta, helpers] = useField({ name });

  const [query, setQuery] = React.useState<string>('');

  return (
    <Combobox onChange={(value: any) => helpers.setValue(value.id)}>
      {({ open }) => (
        <div className="relative">
          <Combobox.Button className="relative w-full rounded-lg bg-white">
            <Combobox.Input
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(requester: any) => requester?.name}
              placeholder="Selecione um solicitante"
              className="w-full py-2 pl-3 pr-10 rounded-lg border"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <div className="h-5 w-5" aria-hidden="true">
                <Icon
                  name="search"
                  alt="menu"
                  color="gray"
                  stroke
                  w={20}
                  h={20}
                />
              </div>
            </div>
          </Combobox.Button>
          <AddRequestersSelectOptions
            query={query}
            open={open}
            groupId={groupId}
          />
        </div>
      )}
    </Combobox>
  );
};

export default AddRequestersSelect;

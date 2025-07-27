import * as React from 'react';
import { useField, useFormikContext } from 'formik';
import { Combobox } from '@headlessui/react';
import { Icon } from 'printer-ui';
import { SelectVisibilityProps } from './types';
import SelectVisibilityOptions from './Options';

const SelectVisibility = ({ name }: SelectVisibilityProps) => {
  const [_field, _meta, helpers] = useField({ name });

  const { initialValues }: { initialValues: any } = useFormikContext();

  return (
    <Combobox
      onChange={(value: any) => helpers.setValue(value)}
      defaultValue={initialValues[name]}
    >
      {({ open }) => (
        <div className="relative">
          <Combobox.Button className="relative w-full rounded-lg bg-white">
            <Combobox.Input
              onChange={(event) => event.target.value}
              displayValue={(event: any) =>
                event === true ? 'Privado' : 'Público'
              }
              className="w-full py-1.5 pl-3 pr-10 rounded-md border"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <div className="h-5 w-5" aria-hidden="true">
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
          <div className="absolute mt-1 max-h-96 w-full overflow-auto rounded-md shadow-lg bg-white py-1 z-10">
            <SelectVisibilityOptions />
          </div>
        </div>
      )}
    </Combobox>
  );
};

export default SelectVisibility;

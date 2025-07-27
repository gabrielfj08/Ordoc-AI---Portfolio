import * as React from 'react';
import { useField } from 'formik';
import { Listbox } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { SelectProps } from './types';

const Select = ({ disabled = false, name, options }: SelectProps) => {
  const [field, _meta, helpers] = useField({
    name,
  });

  return (
    <Listbox
      value={field.value.name}
      onChange={(values) => {
        helpers.setValue(values);
      }}
      disabled={disabled}
    >
      {({ open }) => (
        <div className="relative">
          <Listbox.Button className="relative w-full rounded bg-white border h-9 text-left pl-2 disabled:border-gray/70 disabled:text-gray disabled:bg-lighterGray">
            <Typography
              variant="footnote1"
              className="truncate"
              color={disabled ? 'gray' : 'black'}
            >
              {field.value.name || options[0].name}
            </Typography>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <Icon
                alt="upDown"
                name={open ? 'up' : 'down'}
                stroke
                w={20}
                h={20}
                color={disabled ? 'gray' : 'black'}
              />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 z-10 max-h-52 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option.name}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-2 pr-4 ${
                    active && 'bg-blue/5'
                  } ${field.value.name === option.name && 'bg-blue/5'}`
                }
                value={option.value}
              >
                <Typography
                  variant="footnote1"
                  color={field.value.name === option.name && 'info'}
                >
                  {option.name}
                </Typography>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      )}
    </Listbox>
  );
};

export default Select;

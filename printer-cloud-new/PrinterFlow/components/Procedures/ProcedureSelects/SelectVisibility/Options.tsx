import * as React from 'react';
import { Combobox } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';

const SelectVisibilityOptions = () => {
  return (
    <Combobox.Options>
      <Combobox.Option
        key="Público"
        value={false}
        className={({ active }) =>
          `relative py-2 pl-3 pr-4 ${
            active ? 'bg-blue/5 text-black' : 'text-gray-900'
          }`
        }
      >
        <div className="flex items-center space-x-2">
          <Icon
            alt="unlocked"
            name="unlocked"
            stroke
            w={22}
            h={22}
            color="success"
          />
          <Typography variant="footnote1">Público</Typography>
        </div>
      </Combobox.Option>
      <Combobox.Option
        key="Privado"
        value={true}
        className={({ active }) =>
          `relative py-1.5 pl-3 pr-4 ${
            active ? 'bg-blue/5 text-black' : 'text-gray-900'
          }`
        }
      >
        <div className="flex items-center space-x-2">
          <Icon alt="locked" name="locked" stroke w={22} h={22} color="error" />
          <Typography variant="footnote1">Privado</Typography>
        </div>
      </Combobox.Option>
    </Combobox.Options>
  );
};

export default SelectVisibilityOptions;

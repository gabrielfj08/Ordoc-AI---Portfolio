import * as React from 'react';
import { Combobox } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';

const SelectPriorityOptions = () => {
  return (
    <Combobox.Options>
      <Combobox.Option
        key="Alta"
        value="high"
        className={({ active }) =>
          `relative py-1.5 pl-3 pr-4 ${
            active ? 'bg-blue/5 text-black' : 'text-gray-900'
          }`
        }
      >
        <div className="flex items-center space-x-2">
          <Icon
            alt="highPriority"
            name="highPriority"
            stroke
            fill
            w={22}
            h={22}
            color="red"
          />
          <Typography variant="footnote1">Alta</Typography>
        </div>
      </Combobox.Option>
      <Combobox.Option
        key="Normal"
        value="normal"
        className={({ active }) =>
          `relative py-2 pl-3 pr-4 ${
            active ? 'bg-blue/5 text-black' : 'text-gray-900'
          }`
        }
      >
        <div className="flex items-center space-x-2">
          <Icon
            alt="mediumPriority"
            name="mediumPriority"
            stroke
            fill
            w={22}
            h={22}
            color="yellow"
          />
          <Typography variant="footnote1">Normal</Typography>
        </div>
      </Combobox.Option>
    </Combobox.Options>
  );
};

export default SelectPriorityOptions;

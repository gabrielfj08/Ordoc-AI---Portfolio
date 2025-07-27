import * as React from 'react';
import { useField, useFormikContext } from 'formik';
import { Combobox } from '@headlessui/react';
import { Icon } from 'printer-ui';
import { transformTaskFieldType } from '../../../utils';
import { SelectFieldTypeProps } from './types';
import SelectFieldTypeOptions from './Options';
import { UpdateTaskFieldFormValues } from '../Update/types';

const SelectFieldType = ({ name, fieldType }: SelectFieldTypeProps) => {
  const [_field, _meta, helpers] = useField({ name });
  const { initialValues }: { initialValues: UpdateTaskFieldFormValues } =
    useFormikContext();

  const [query, setQuery] = React.useState<string>('');

  return (
    <Combobox
      onChange={(value: any) => helpers.setValue(value.value)}
      defaultValue={initialValues[name]}
    >
      {({ open }) => (
        <div className="relative">
          <Combobox.Button className="relative w-full rounded-lg bg-white">
            <Combobox.Input
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(fieldType: any) =>
                fieldType.name || transformTaskFieldType(fieldType)
              }
              placeholder="Selecione um tipo de campo"
              className="w-full py-2 pl-3 pr-10 rounded-lg border"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <Icon
                name={open ? 'up' : 'down'}
                alt="down"
                color="gray"
                stroke
                w={20}
                h={20}
              />
            </div>
          </Combobox.Button>
          <SelectFieldTypeOptions open={open} fieldType={fieldType} />
        </div>
      )}
    </Combobox>
  );
};

export default SelectFieldType;

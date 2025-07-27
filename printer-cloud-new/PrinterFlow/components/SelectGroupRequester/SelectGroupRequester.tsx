import * as React from 'react';
import { useField, useFormikContext } from 'formik';
import { SelectGroupProps } from './types';
import SelectGroupRequestersOptions from './Options';
import { Combobox } from '@headlessui/react';
import { Icon } from 'printer-ui';
import { EditSubjectFormValues } from '../../ProcedureTemplates/Subject/Edit/types';

const SelectGroupRequester = ({ name, initialValue }: SelectGroupProps) => {
  const [_field, _meta, helpers] = useField({ name });
  const { initialValues }: { initialValues: EditSubjectFormValues } =
    useFormikContext();

  const [query, setQuery] = React.useState<string>('');

  return (
    <Combobox
      onChange={(value: any) => {
        helpers.setValue(value.id);
      }}
      defaultValue={initialValue}
    >
      {({ open }) => (
        <div className="relative ">
          <Combobox.Button className="relative w-full rounded-lg bg-white">
            <Combobox.Input
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(groupRequester: any) =>
                groupRequester?.name || initialValue
              }
              placeholder="Selecione um grupo"
              className="w-full py-2 pl-3 pr-10 rounded-lg border"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <Icon
                name="search"
                alt="menu"
                color="gray"
                stroke
                w={20}
                h={20}
              />
            </div>
          </Combobox.Button>

          <SelectGroupRequestersOptions query={query} open={open} />
        </div>
      )}
    </Combobox>
  );
};

export default SelectGroupRequester;

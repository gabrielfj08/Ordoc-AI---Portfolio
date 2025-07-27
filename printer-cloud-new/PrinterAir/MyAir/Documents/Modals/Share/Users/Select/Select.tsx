import * as React from 'react';
import { useField } from 'formik';
import { Combobox } from '@headlessui/react';
import { Icon } from 'printer-ui';
import { UserSelectProps } from './types';
import UserSelectOptions from './Options';

const UserSelect = ({ name, documentId }: UserSelectProps) => {
  const [_field, _meta, helpers] = useField({ name });

  const [query, setQuery] = React.useState<string>('');

  return (
    <Combobox onChange={(value: any) => helpers.setValue(value.id)}>
      <div className="relative">
        <Combobox.Button className="relative w-full rounded-lg bg-white">
          <Combobox.Input
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(user: any) => user?.username}
            placeholder="Selecione o usuário"
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
        <UserSelectOptions query={query} documentId={documentId} />
      </div>
    </Combobox>
  );
};

export default UserSelect;

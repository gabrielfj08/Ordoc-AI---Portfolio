import * as React from 'react';
import { useField } from 'formik';
import { Combobox } from '@headlessui/react';
import { Icon } from 'printer-ui';
import { SelectSubjectProps } from './types';
import SubjectSelectOptionsContainer from './Options';
import SubjectSelectOptionsError from './Options/Error';

const SelectSubject = ({
  name,
  parentProcedureTemplateId,
  key,
}: SelectSubjectProps) => {
  const [_field, _meta, helpers] = useField({ name });
  const [isError, setIsError] = React.useState<boolean>(false);

  if (isError) return <SubjectSelectOptionsError />;

  const [query, setQuery] = React.useState<string>('');
  return (
    <Combobox key={key} onChange={(value: any) => helpers.setValue(value.id)}>
      {({ open }) => (
        <div className="relative">
          <Combobox.Button className="relative w-full rounded-lg bg-white">
            <Combobox.Input
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              displayValue={(subjects: any) => subjects?.name}
              placeholder="Selecione o assunto"
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
          <SubjectSelectOptionsContainer
            open={open}
            setError={setIsError}
            query={query}
            procedureTemplateId={parentProcedureTemplateId}
          />
        </div>
      )}
    </Combobox>
  );
};

export default SelectSubject;

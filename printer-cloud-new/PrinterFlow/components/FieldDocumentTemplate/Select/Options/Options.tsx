import * as React from 'react';
import Link from 'next/link';
import router from 'next/router';
import { Combobox } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { useModal } from '../../../../../hooks';
import { SelectFieldDocumentTemplateOptionsProps } from './types';
import NewFieldDocumentTemplateModal from '../../../../ProcedureTemplates/FieldDocumentTemplates/Modals/New';

const SelectFieldDocumentTemplateOptions = ({
  fieldDocumentTemplates,
}: SelectFieldDocumentTemplateOptionsProps) => {
  const { openModal } = useModal();

  return (
    <Combobox.Options>
      {fieldDocumentTemplates.map((fieldDocumentTemplate) => {
        return (
          <Combobox.Option
            key={fieldDocumentTemplate.id}
            value={fieldDocumentTemplate}
            className={({ active }) =>
              `relative py-2 pl-3 pr-4 ${
                active ? 'bg-blue/5 text-black' : 'text-gray-900'
              }`
            }
          >
            <div className="flex items-center justify-between">
              <Typography variant="footnote1">
                {fieldDocumentTemplate.name}
              </Typography>
              <Typography
                variant="footnote2"
                color="info"
                className="underline"
              >
                {!router.query.id ? (
                  <Link
                    href={`/printer-flow/procedure-templates/${router.query.procedureTemplateId}?fieldDocumentTemplateId=${fieldDocumentTemplate.id}`}
                  >
                    Ver modelo
                  </Link>
                ) : (
                  <Link
                    href={`/printer-flow/procedure-templates/${router.query.procedureTemplateId}/subjects/${router.query.id}?fieldDocumentTemplateId=${fieldDocumentTemplate.id}`}
                  >
                    Ver modelo
                  </Link>
                )}
              </Typography>
            </div>
          </Combobox.Option>
        );
      })}
      <Combobox.Option
        key={`button-id`}
        value="Button"
        className="relative py-2 pl-3 pr-4"
      >
        <button
          className="h-10 w-full bg-lightGray rounded-lg flex justify-center items-center space-x-2"
          type="button"
          onClick={() => openModal(<NewFieldDocumentTemplateModal />)}
        >
          <Icon name="plus" alt="criar" w={23} h={23} stroke />
          <p>Criar modelo</p>
        </button>
      </Combobox.Option>
    </Combobox.Options>
  );
};

export default SelectFieldDocumentTemplateOptions;

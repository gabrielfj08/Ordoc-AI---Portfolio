import * as React from 'react';
import { Form, Formik } from 'formik';
import { Popover } from '@headlessui/react';
import { ActionBox, Button, Icon, Typography } from 'printer-ui';
import { FilterButtonTaskTemplatesProps } from './types';

const FilterButtonTaskTemplates = ({
  children,
  params,
  setParams,
}: FilterButtonTaskTemplatesProps) => {
  return (
    <Popover className="flex flex-col w-fit">
      {({ close }) => (
        <Formik
          initialValues={{ status: params.status }}
          onSubmit={(values) => {
            setParams({
              ...params,
              page: 1,
              status: values.status,
            });
            close();
          }}
        >
          {(formik) => (
            <>
              <div className="flex">
                <Popover.Button
                  className={`outline-none h-7 sm:h-9 text-[12px] sm:text-[15px] border-[2.3px] space-x-2 flex
                  ${
                    params.status
                      ? 'bg-error rounded-l-md pl-[18px]'
                      : 'bg-info rounded-md px-[18px]'
                  } border-white/0 w-auto items-center justify-center`}
                >
                  <Icon
                    alt="filter"
                    name="filter"
                    color="white"
                    stroke
                    w={24}
                    h={24}
                  />
                  <Typography variant="button" color="white">
                    {params.status ? 'Limpar filtro' : 'Filtrar'}
                  </Typography>
                </Popover.Button>
                <div className="block sm:hidden">
                  <button
                    className={`bg-error h-7 sm:h-9 text-[12px] sm:text-[15px] rounded-r-md px-1 ${
                      params.status ? 'block' : 'hidden'
                    } 
}`}
                    type="submit"
                    onClick={() => {
                      formik.resetForm();
                      formik.handleSubmit();
                    }}
                  >
                    <Icon
                      alt="x"
                      name="close"
                      stroke
                      color="white"
                      w={26}
                      h={26}
                    />
                  </button>
                </div>
                <div className="hidden sm:block">
                  <button
                    className={`bg-error h-7 sm:h-9 text-[12px] sm:text-[15px] rounded-r-md px-1 ${
                      params.status ? 'block' : 'hidden'
                    } 
}`}
                    type="submit"
                    onClick={() => {
                      formik.resetForm();
                      formik.handleSubmit();
                    }}
                  >
                    <Icon alt="x" name="close" stroke color="white" />
                  </button>
                </div>
              </div>
              <Popover.Panel className="flex justify-end sm:justify-center z-20">
                <div className="mt-1.5 absolute rounded-lg shadow-default">
                  <ActionBox>
                    <Form className="flex items-center flex-col">
                      {children}
                      <ActionBox.Footer>
                        <div className="sm:hidden flex justify-between w-52">
                          <Button
                            size="sm"
                            label="Cancelar"
                            color="error"
                            type="button"
                            onClick={close}
                          />
                          <Button
                            label="Filtrar"
                            color="info"
                            type="submit"
                            size="sm"
                          />
                        </div>
                        <div className="hidden sm:flex space-x-8 justify-between w-72">
                          <Button
                            label="Cancelar"
                            color="error"
                            type="button"
                            onClick={close}
                          />
                          <Button label="Filtrar" color="info" type="submit" />
                        </div>
                      </ActionBox.Footer>
                    </Form>
                  </ActionBox>
                </div>
              </Popover.Panel>
            </>
          )}
        </Formik>
      )}
    </Popover>
  );
};
export default FilterButtonTaskTemplates;

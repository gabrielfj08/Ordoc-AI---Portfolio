import * as React from 'react';
import { Popover } from '@headlessui/react';
import { Form, Formik } from 'formik';
import { useAuth } from '../../../../hooks';
import { UserService } from '../../../../services';
import { ActionBox, Button, Icon, Typography, Switch } from 'printer-ui';
import { FilterButtonProcedureProps } from './types';

const FilterButtonProcedure = ({
  children,
  params,
  setParams,
}: FilterButtonProcedureProps) => {
  const [isChecked, setIsChecked] = React.useState<boolean>(false);
  const [userId, setUserId] = React.useState<number>(
    Number(params.createdById)
  );

  const handleChange = () => {
    setIsChecked((current) => !current);
    setUserId(0);
  };

  return (
    <Popover className="flex flex-col w-fit">
      {({ close }) => (
        <Formik
          initialValues={{
            source: params.source,
            priority: params.priority,
            private: params.private,
            createdById: params.createdById,
          }}
          onSubmit={(values) => {
            setParams({
              ...params,
              page: 1,
              source: values.source,
              priority: values.priority,
              private: values.private,
              createdById: isChecked === true ? userId : values.createdById,
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
                    params.source ||
                    params.priority ||
                    params.private ||
                    params.createdById === 0
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
                    {params.source ||
                    params.priority ||
                    params.private ||
                    params.createdById === 0
                      ? 'Limpar filtro'
                      : 'Filtrar'}
                  </Typography>
                </Popover.Button>
                <div className="block sm:hidden">
                  <button
                    className={`bg-error h-7 sm:h-9 text-[12px] sm:text-[15px] rounded-r-md px-1 ${
                      params.source ||
                      params.priority ||
                      params.private ||
                      params.createdById === 0
                        ? 'block'
                        : 'hidden'
                    } 
}`}
                    type="submit"
                    onClick={() => {
                      formik.resetForm();
                      setIsChecked(false);
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
                      params.source ||
                      params.priority ||
                      params.private ||
                      params.createdById === 0
                        ? 'block'
                        : 'hidden'
                    } 
}`}
                    type="submit"
                    onClick={() => {
                      formik.resetForm();
                      setIsChecked(false);
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
                    <Form className="flex items-center flex-col space-x-2">
                      {children}
                      <div className="flex items-center space-x-2 mb-2 pr-8 sm:pr-28">
                        <Typography variant="footnote1" family="robotoMedium">
                          Processos criados pelo grupo:
                        </Typography>
                        <Switch
                          name="createdById"
                          onChange={handleChange}
                          checked={isChecked}
                        />
                      </div>
                      <ActionBox.Footer>
                        <div className="sm:hidden flex w-52 justify-between">
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
                        <div className="hidden sm:flex space-x-8 w-72 justify-between">
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
export default FilterButtonProcedure;

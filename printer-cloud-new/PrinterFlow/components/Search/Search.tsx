import * as React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Icon, Input, Item, Typography } from 'printer-ui';
import { SearchProps } from './types';
import { sortMapping, sortOptions } from './Select';
import Pagination from '../../../components/Pagination/Pagination';
import SearchSortSelect from './Select/Select';
import SearchTable from './Table';
import SearchTableInitialMessage from './Table/InitialMessage';

const GeneralSearchPage = ({ params, setParams }: SearchProps) => {
  const [sortSelection, setSortSelection] = React.useState(sortOptions[0]);
  const [totalObjects, setTotalObjects] = React.useState(0);
  const [initialTable, setInitialTable] = React.useState<boolean>(true);

  const initialValues = {
    q: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        setParams({ ...params, q: values.q });
      }}
      validationSchema={Yup.object().shape({
        q: Yup.string().required('A consulta não pode ser vazia.'),
      })}
    >
      {(formik) => (
        <Form>
          <div className="space-y-4 pt-2 w-full h-full">
            <div className="hidden sm:flex items-center justify-start space-x-4">
              <div className="w-6/12 pl-2 hidden sm:block">
                <Input
                  placeholder="Digite o código do processo OU o tipo de processo/assunto "
                  type="search"
                  float
                  name="q"
                  size="md"
                  w="full"
                  value={formik.values.q}
                  onChange={formik.handleChange}
                >
                  <Icon name="search" alt="search" color="gray" stroke />
                </Input>
              </div>
              <Button
                label="Consultar"
                type="submit"
                color="info"
                size="md"
                onClick={() => {
                  setInitialTable(false);
                }}
                disabled={formik.values.q ? false : true}
              />
            </div>
            <div className="sm:hidden flex items-center justify-between">
              <div className="w-9/12 sm:hidden block pr-1">
                <Input
                  placeholder="Digite o código do processo OU o tipo de processo/assunto"
                  type="search"
                  float
                  name="q"
                  size="sm"
                  w="full"
                  value={formik.values.q}
                  onChange={formik.handleChange}
                >
                  <Icon
                    name="search"
                    alt="search"
                    color="gray"
                    stroke
                    w={20}
                    h={20}
                  />
                </Input>
              </div>
              <Button
                label="Consultar"
                type="submit"
                color="info"
                size="sm"
                onClick={() => {
                  setInitialTable(false);
                }}
                disabled={formik.values.q ? false : true}
              />
            </div>
            <div className="sm:px-0 px-2">
              <Typography
                variant="footnote2"
                family="robotoLight"
                color="gray"
                className="italic"
              >
                * A consulta é válida para processos públicos e processos
                privados nos quais você é interessado(a), na sua instituição.
              </Typography>
            </div>
            <div className="flex justify-between items-center">
              <div className="hidden sm:flex items-center space-x-2">
                <Typography
                  variant="footnote1"
                  color="gray"
                  className="hidden sm:block"
                >
                  Ordenar por
                </Typography>
                <SearchSortSelect
                  size="md"
                  w="52"
                  sortSelection={sortSelection}
                  setSortSelection={(item: Item) => {
                    setSortSelection(item);
                    setParams({
                      ...params,
                      ...sortMapping[item.id],
                      page: 1,
                    });
                  }}
                />
              </div>
              <div className="sm:hidden">
                <SearchSortSelect
                  size="sm"
                  w="44"
                  sortSelection={sortSelection}
                  setSortSelection={(item: Item) => {
                    setSortSelection(item);
                    setParams({
                      ...params,
                      ...sortMapping[item.id],
                      page: 1,
                    });
                  }}
                />
              </div>
              <Pagination
                page={Number(params.page)}
                setPage={(page) => setParams({ ...params, page: page })}
                totalPages={Math.ceil(totalObjects / Number(params.perPage))}
                totalObjects={totalObjects}
                objectsPerPage={Number(params.perPage)}
              />
            </div>
            <div className="px-2">
              {initialTable ? (
                <SearchTableInitialMessage />
              ) : (
                <SearchTable
                  params={params}
                  setTotalObjects={setTotalObjects}
                />
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default GeneralSearchPage;

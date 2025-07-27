import * as React from 'react';
import { Form, Formik, Field, FieldArray } from 'formik';
import { Popover, Transition } from '@headlessui/react';
import { Button, Icon, Input, Typography } from 'printer-ui';
import { useSession } from '../../../../hooks';
import { FilterButtonProps, FilterButtonFormValues } from './types';
import UserSelect from '../../../../components/PrinterCloud/Users/Select';
import DirectorySelect from '../../../../PrinterAir/components/Directories/Select';

const buildSearchItems = (q: string, defType: string | null) => {
  if (!q || !defType || defType === 'dismax') return;
  let searchString = q.replace(/[\(\)]/g, '');

  const searchItems = searchString.split(/ OR | AND /).map((item) => {
    const [field, q] = item.split(':');

    return {
      field,
      q: q === '*' ? '' : q,
    };
  });

  const operators = searchString
    .split(' ')
    .filter((word) => word === 'OR' || word === 'AND');

  return searchItems.map((searchItem, index) => {
    if (index) {
      return {
        ...searchItem,
        q: searchItem.q.slice(1, -1),
        'q.op': operators[index - 1],
      };
    } else {
      return {
        ...searchItem,
        q: searchItem.q.slice(1, -1),
        'q.op': '',
      };
    }
  });
};

const buildSharedStatus = (shared: string, hasLink: string) => {
  const result: Array<string> = [];

  if (shared === 'true') result.push('shared');
  if (hasLink === 'true') result.push('hasLink');

  return result;
};

const FilterButton = ({ clear, onSubmit, queryString }: FilterButtonProps) => {
  const { session } = useSession();

  if (!session.organization) return null;

  const searchParams = new URLSearchParams(queryString);

  const startCreatedAt =
    searchParams
      .get('created_at')
      ?.replace(/[\[\] ]/g, '')
      .split('TO')[0]
      .split('T')[0] || '';

  const endCreatedAt =
    searchParams
      .get('created_at')
      ?.replace(/[\[\] ]/g, '')
      .split('TO')[1]
      .split('T')[0] || '';

  const startUpdatedAt =
    searchParams
      .get('updated_at')
      ?.replace(/[\[\] ]/g, '')
      .split('TO')[0]
      .split('T')[0] || '';

  const endUpdatedAt =
    searchParams
      .get('updated_at')
      ?.replace(/[\[\] ]/g, '')
      .split('TO')[1]
      .split('T')[0] || '';

  const initialValues: FilterButtonFormValues = {
    createdAt: {
      start: startCreatedAt === '*' ? '' : startCreatedAt,
      end: endCreatedAt === '*' ? '' : endCreatedAt,
    },
    createdById: searchParams.get('created_by_id') || '*',
    path: searchParams.get('path') || '/Meu Air',
    searchItems: buildSearchItems(
      searchParams.get('q') as string,
      searchParams.get('defType')
    ) || [
      {
        q: '',
        'q.op': '',
        field: 'content',
      },
    ],
    sharedStatus: buildSharedStatus(
      searchParams.get('shared') as string,
      searchParams.get('has_link') as string
    ),
    status: searchParams.get('status') || '*',
    updatedAt: {
      start: startUpdatedAt === '*' ? '' : startUpdatedAt,
      end: endUpdatedAt === '*' ? '' : endUpdatedAt,
    },
    updatedById: searchParams.get('updated_by_id') || '*',
  };

  return (
    <div>
      <Popover as="div">
        <div>
          <Popover.Button className="flex bg-white h-10 w-full rounded-md space-x-2 items-center pl-2">
            {new URLSearchParams(queryString).get('defType') === 'lucene' ? (
              <div className="flex bg-white h-10 w-full rounded-md items-center justify-between pl-2">
                <Icon name="filter" alt="filter" stroke w={22} h={22} />
                <Typography
                  variant="footnote1"
                  family="robotoMedium"
                  color="red"
                >
                  Limpar Filtro
                </Typography>
                <Button
                  color="white"
                  className="w-2"
                  onClick={(event) => {
                    event.stopPropagation();
                    clear();
                  }}
                  type="button"
                >
                  <Button.Icon
                    name="close"
                    alt="close"
                    color="red"
                    w={24}
                    h={24}
                    stroke
                    fill
                  />
                </Button>
              </div>
            ) : (
              <div className="flex bg-white h-10 w-full rounded-md space-x-2 items-center justify-between pl-2">
                <Icon name="filter" alt="filter" stroke w={22} h={22} />
                <Typography variant="footnote1" family="robotoMedium">
                  Filtro Avançado
                </Typography>
                <div className="w-4" />
              </div>
            )}
          </Popover.Button>
        </div>
        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute z-10 left-0 w-full md:w-[768px] bg-white mt-2 p-4 shadow-default rounded-md">
            {({ close }) => (
              <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={(values: FilterButtonFormValues) => {
                  onSubmit(values);
                  close();
                }}
              >
                {(formik) => (
                  <Form>
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-[80vh]">
                      <FieldArray
                        name="searchItems"
                        render={(arrayHelpers) => (
                          <div className="flex flex-col gap-2">
                            {formik.values.searchItems.map(
                              (_searchItem, index) => (
                                <div
                                  className="flex flex-col gap-2 p-2 bg-lighterGray rounded-md"
                                  key={index}
                                >
                                  <Typography variant="footnote1">
                                    Buscar por
                                  </Typography>
                                  <div className="flex flex-wrap gap-2">
                                    <div className="w-20 h-8">
                                      {index === 0 ? (
                                        <Field
                                          component="select"
                                          name={`searchItems[${index}]['q.op']`}
                                          disabled
                                          className="block appearance-none w-20 h-9 bg-lightGray border pl-4 pr-6 rounded shadow leading-tight focus:outline-none focus:shadow-outline truncate"
                                        >
                                          <option value="">--</option>
                                        </Field>
                                      ) : (
                                        <Field
                                          component="select"
                                          name={`searchItems[${index}]['q.op']`}
                                          className="block appearance-none w-20 h-9 border pl-4 pr-6 rounded shadow leading-tight focus:outline-none focus:shadow-outline truncate"
                                        >
                                          <option value="OR">OU</option>
                                          <option value="AND">E</option>
                                        </Field>
                                      )}
                                    </div>
                                    <div className="w-44">
                                      <Field
                                        component="select"
                                        name={`searchItems[${index}].field`}
                                        className="block appearance-none w-full h-9 border pl-4 pr-6 rounded shadow leading-tight focus:outline-none focus:shadow-outline truncate"
                                      >
                                        <option value="content">
                                          Conteúdo
                                        </option>
                                        <option value="original_filename">
                                          Nome
                                        </option>
                                        <option value="description">
                                          Descrição
                                        </option>
                                        <option value="location">
                                          Localização
                                        </option>
                                      </Field>
                                    </div>
                                    <div className="flex sm:w-auto w-full flex-grow gap-2">
                                      <Field
                                        name={`searchItems[${index}].q`}
                                        placeholder="Pesquisar no Printer Air..."
                                        className="w-full px-2 border border-black rounded-md"
                                      />
                                      <div className="flex gap-2">
                                        <Button
                                          label="-"
                                          color="info"
                                          type="button"
                                          disabled={index === 0}
                                          onClick={() => {
                                            arrayHelpers.remove(index);
                                          }}
                                          className="w-8"
                                        />
                                        <Button
                                          label="+"
                                          color="info"
                                          type="button"
                                          onClick={() => {
                                            arrayHelpers.push({
                                              q: '',
                                              'q.op': 'OR',
                                              field: 'content',
                                            });
                                          }}
                                          className="w-8"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      />
                      <div className="flex flex-col gap-2 p-2 bg-lighterGray rounded-md">
                        <Typography variant="footnote1">Pasta</Typography>
                        <DirectorySelect
                          name="path"
                          parentDirectoryId={
                            session.organization.rootDirectory.id
                          }
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex flex-col flex-grow gap-2 w-full sm:w-24  p-2 bg-lighterGray rounded-md">
                          <Typography variant="footnote1">Status</Typography>
                          <Field
                            component="select"
                            name="status"
                            className="block appearance-none w-full h-9 border pl-4 pr-6 rounded shadow leading-tight focus:outline-none focus:shadow-outline truncate"
                          >
                            <option value="*">Todos</option>
                            <option value="created">Criado</option>
                            <option value="enqueued">Processando OCR</option>
                            <option value="processed">Processou OCR</option>
                            <option value="failed">Falhou OCR</option>
                          </Field>
                        </div>
                        <div className="flex flex-col flex-grow gap-4 w-full sm:w-auto p-2 bg-lighterGray rounded-md">
                          <Typography variant="footnote1">
                            Compartilhado
                          </Typography>
                          <div className="flex gap-5">
                            <div className="flex gap-2">
                              <Field
                                id="shared"
                                type="checkbox"
                                name="sharedStatus"
                                value="shared"
                              />
                              <label
                                htmlFor="shared"
                                className="flex gap-2 items-center"
                              >
                                <Icon
                                  name="shared"
                                  alt="filter"
                                  fill
                                  w={22}
                                  h={22}
                                />
                                <Typography variant="footnote1">
                                  Internamente
                                </Typography>
                              </label>
                            </div>
                            <div className="flex gap-2">
                              <Field
                                id="hasLink"
                                type="checkbox"
                                name="sharedStatus"
                                value="hasLink"
                              />
                              <label
                                htmlFor="hasLink"
                                className="flex gap-2 items-center"
                              >
                                <Icon
                                  name="link"
                                  alt="filter"
                                  fill
                                  w={22}
                                  h={22}
                                />
                                <Typography variant="footnote1">
                                  Externamente
                                </Typography>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex flex-col flex-grow w-full sm:w-auto gap-2 p-2 bg-lighterGray rounded-md">
                          <Typography variant="footnote1">
                            Criado por
                          </Typography>
                          <UserSelect name="createdById" />
                        </div>
                        <div className="flex flex-col flex-grow w-full sm:w-auto gap-2 p-2 bg-lighterGray rounded-md">
                          <Typography variant="footnote1">
                            Atualizado por
                          </Typography>
                          <UserSelect name="updatedById" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 p-2 bg-lighterGray rounded-md">
                        <Typography variant="footnote1">
                          Data de criação
                        </Typography>
                        <div className="flex gap-2 items-center">
                          <Typography variant="footnote1">Início</Typography>
                          <Input
                            name="createdAt.start"
                            onChange={formik.handleChange}
                            value={formik.values.createdAt.start}
                            size="md"
                            placeholder=""
                            type="date"
                          />
                          <Typography variant="footnote1">Fim</Typography>
                          <Input
                            name="createdAt.end"
                            onChange={formik.handleChange}
                            value={formik.values.createdAt.end}
                            size="md"
                            placeholder=""
                            type="date"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 p-2 bg-lighterGray rounded-md">
                        <Typography variant="footnote1">
                          Data de atualização
                        </Typography>
                        <div className="flex gap-2 items-center">
                          <Typography variant="footnote1">Início</Typography>
                          <Input
                            name="updatedAt.start"
                            onChange={formik.handleChange}
                            value={formik.values.updatedAt.start}
                            size="md"
                            placeholder=""
                            type="date"
                          />
                          <Typography variant="footnote1">Fim</Typography>
                          <Input
                            name="updatedAt.end"
                            onChange={formik.handleChange}
                            value={formik.values.updatedAt.end}
                            size="md"
                            placeholder=""
                            type="date"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Button
                          label="Cancelar"
                          color="red"
                          className="w-40"
                          type="button"
                          onClick={() => close()}
                        />
                        <Button
                          label="Buscar"
                          color="info"
                          className="w-40"
                          type="submit"
                        />
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
};

export default FilterButton;

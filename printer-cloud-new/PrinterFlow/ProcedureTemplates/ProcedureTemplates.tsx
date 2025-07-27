import * as React from 'react';
import router from 'next/router';
import { Button, Icon, Input, Item, Typography } from 'printer-ui';
import { ProcedureTemplateProps } from './types';
import ProcedureTemplateFilter from './Filter';
import ProcedureTemplateSortSelect, {
  sortMapping,
  sortOptions,
} from './Select';
import Pagination from '../../components/Pagination/Pagination';
import ProcedureTemplatesTableContainer from '../components/ProcedureTemplates/Table';
import FilterButtonProcedureTemplateContainer from '../components/FilterProcedureTemplate';

const ProcedureTemplate = ({ setParams, params }: ProcedureTemplateProps) => {
  const [sortSelection, setSortSelection] = React.useState(sortOptions[0]);
  const [totalObjects, setTotalObjects] = React.useState(0);

  return (
    <div className="w-full mb-12">
      <div className="sm:flex sm:space-x-2.5 space-y-4 sm:space-y-0 my-6 px-3">
        <Button
          onClick={() => {
            router.push(`/printer-flow/procedure-templates/new`);
          }}
          label="Tipo de processo"
          color="info"
          className="hidden sm:flex"
        >
          <Button.Icon
            alt="plus"
            name="plus"
            color="white"
            stroke
            w={24}
            h={24}
          />
        </Button>
        <div className="w-full sm:w-5/12 hidden sm:block">
          <Input
            type="search"
            float
            name="q"
            size="md"
            w="full"
            value={params.q}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setParams({ ...params, q: e.target.value, page: 1 });
            }}
          >
            <Icon alt="search" name="search" color="gray" stroke />
          </Input>
        </div>
        <div className="w-full sm:hidden block">
          <Input
            type="search"
            float
            name="q"
            size="sm"
            w="full"
            value={params.q}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setParams({ ...params, q: e.target.value, page: 1 });
            }}
          >
            <Icon
              alt="search"
              name="search"
              color="gray"
              stroke
              w={24}
              h={24}
            />
          </Input>
        </div>
        <div className="flex justify-between">
          <Button
            label="Tipo de processo"
            color="info"
            size="sm"
            className="sm:hidden"
            onClick={() => {
              router.push(`/printer-flow/procedure-templates/new`);
            }}
          >
            <Button.Icon
              alt="plus"
              name="plus"
              color="white"
              stroke
              w={20}
              h={20}
            />
          </Button>
          <FilterButtonProcedureTemplateContainer
            params={params}
            setParams={setParams}
          >
            <ProcedureTemplateFilter />
          </FilterButtonProcedureTemplateContainer>
        </div>
      </div>
      <div className="flex justify-between items-center my-4 sm:mr-10 px-3">
        <span className="flex items-center sm:space-x-2.5">
          <Typography
            variant="footnote1"
            color="gray"
            className="hidden sm:block"
          >
            Ordenar por
          </Typography>
          <div className="hidden sm:block">
            <ProcedureTemplateSortSelect
              size="md"
              w="52"
              sortSelection={sortSelection}
              setSortSelection={(item: Item) => {
                setSortSelection(item);
                setParams({ ...params, ...sortMapping[item.id], page: 1 });
              }}
            />
          </div>
          <div className="sm:hidden">
            <ProcedureTemplateSortSelect
              size="sm"
              w="44"
              sortSelection={sortSelection}
              setSortSelection={(item: Item) => {
                setSortSelection(item);
                setParams({ ...params, ...sortMapping[item.id], page: 1 });
              }}
            />
          </div>
        </span>
        <Pagination
          page={params.page}
          setPage={(page) => setParams({ ...params, page: page })}
          totalPages={Math.ceil(totalObjects / params.perPage)}
          totalObjects={totalObjects}
          objectsPerPage={params.perPage}
        />
      </div>
      <div className="sm:pr-10 px-2">
        <ProcedureTemplatesTableContainer
          params={params}
          setTotalObjects={setTotalObjects}
        />
      </div>
    </div>
  );
};

export default ProcedureTemplate;

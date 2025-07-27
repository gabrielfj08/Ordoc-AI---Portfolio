import * as React from 'react';
import router from 'next/router';
import {
  Search,
  InputV3 as Input,
  ButtonV3 as Button,
  PaginationV3 as Pagination,
  TypographyV3 as Typography,
  Icon,
} from 'printer-ui';
import { useSession } from '../../hooks';
import { ExternalProcedureProps, Item } from './types';
import ProcedureExternalSortSelect, {
  sortMapping,
  sortOptions,
} from '../components/SelectFilter';
import ProcedureTable from './Table';

const ExternalProcedures = ({ params, setParams }: ExternalProcedureProps) => {
  const { session, themeColor } = useSession();

  if (!session) return null;

  const [sortSelection, setSortSelection] = React.useState(
    router.query.status === 'running'
      ? sortOptions[4]
      : router.query.status === 'started'
      ? sortOptions[1]
      : sortOptions[0]
  );
  const [totalObjects, setTotalObjects] = React.useState(0);

  return (
    <div className="w-full flex flex-col mb-24 sm:mb-6 sm:pr-10 sm:pl-20 px-4">
      <Typography
        variant="headline4"
        family="jakartaBold"
        color={themeColor}
        align="start"
        className="py-4"
      >
        Processos
      </Typography>
      <div className="w-full sm:flex sm:gap-4 space-x-0 sm:space-y-0 space-y-4 mb-4">
        <div className="sm:w-5/12 w-full">
          <Search
            w="full"
            placeholder="Ex: 00/0000"
            color={themeColor}
            label="Número do processo ou assunto"
            value={params.q}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setParams({ ...params, q: e.target.value, page: 1 });
            }}
            onClick={() => setParams({ ...params, page: 1, q: '' })}
          />
        </div>
        <div className="grid grid-cols-2 sm:w-4/12 w-full gap-4">
          <Input
            label="Data de criação, desde:"
            max="9999-12-31"
            name="createdAtGte"
            value={params.createdAtGte}
            borderColor={themeColor}
            focusBorderColor={themeColor}
            textColor={themeColor}
            type="date"
            w="full"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setParams({ ...params, createdAtGte: e.target.value, page: 1 });
            }}
          >
            {params.createdAtGte ? (
              <button
                className="h-fit w-fit"
                onClick={() =>
                  setParams({ ...params, page: 1, createdAtGte: '' })
                }
                type="button"
              >
                <Icon
                  alt="x"
                  name="circleClose"
                  color="red"
                  stroke
                  h={16}
                  w={16}
                />
              </button>
            ) : null}
          </Input>
          <Input
            label="Data de criação, até:"
            max="9999-12-31"
            name="createdAtLte"
            value={params.createdAtLte}
            borderColor={themeColor}
            focusBorderColor={themeColor}
            textColor={themeColor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setParams({ ...params, createdAtLte: e.target.value, page: 1 });
            }}
            type="date"
            w="full"
          >
            {params.createdAtLte ? (
              <button
                className="h-fit w-fit"
                onClick={() =>
                  setParams({ ...params, page: 1, createdAtLte: '' })
                }
                type="button"
              >
                <Icon
                  alt="x"
                  name="circleClose"
                  color="red"
                  stroke
                  h={16}
                  w={16}
                />
              </button>
            ) : null}
          </Input>
        </div>
        <div className="sm:w-2/12 w-full">
          <ProcedureExternalSortSelect
            size="md"
            w="full"
            label="Status"
            sortSelection={sortSelection}
            setSortSelection={(item: Item) => {
              setSortSelection(item);
              setParams({ ...params, ...sortMapping[item.id], page: 1 });
            }}
            color={themeColor}
          />
        </div>
        <div className="w-2/12 pt-4 justify-end items-end sm:flex hidden">
          <Button
            w="full"
            label="Novo processo"
            rightIcon="addFile"
            color={themeColor}
            onClick={() => router.push('/flow-cidadao/procedures/new')}
            className="truncate"
          />
        </div>
      </div>

      <div className="w-full sm:h-[295px] h-56 overflow-x-auto">
        <ProcedureTable params={params} setTotalObjects={setTotalObjects} />
      </div>
      <button
        onClick={() => router.push('/flow-cidadao/procedures/new')}
        className={`sm:hidden fixed bottom-0 z-50 right-0 w-16 h-16 mr-7 mb-7 border border-lightGray
          bg-${themeColor} shadow-default rounded-full flex items-center justify-center`}
      >
        <Icon alt="mais processo" name="addFile" stroke color="white" />
      </button>
      <div className="items-center justify-center flex mt-4">
        <Pagination
          color={themeColor}
          page={Number(params.page)}
          setPage={(page) => setParams({ ...params, page: page })}
          totalObjects={totalObjects}
          objectsPerPage={params.perPage}
        />
      </div>
    </div>
  );
};

export default ExternalProcedures;

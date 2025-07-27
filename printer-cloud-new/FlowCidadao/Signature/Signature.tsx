import * as React from 'react';
import router from 'next/router';
import {
  Icon,
  InputV3 as Input,
  PaginationV3 as Pagination,
  TypographyV3 as Typography,
} from 'printer-ui';
import { useSession } from '../../hooks';
import { ExternalSignatureProps, Item } from './types';
import SignatureExternalSortSelect, {
  sortMapping,
  sortOptions,
} from '../components/Signatures/SelectFilter';
import SignatureTable from './Table';

const ExternalSignatures = ({ params, setParams }: ExternalSignatureProps) => {
  const { session } = useSession();

  if (!session) return null;

  const [sortSelection, setSortSelection] = React.useState(
    router.query.status === 'created' ? sortOptions[1] : sortOptions[0]
  );
  const [totalObjects, setTotalObjects] = React.useState(0);

  const colorDef = !!session.organization?.theme
    ? session.organization.theme.color
    : 'cidOrange';

  return (
    <div className="w-full flex flex-col mb-6 sm:pr-10 sm:pl-20 px-4">
      <Typography
        variant="headline4"
        family="jakartaBold"
        color={colorDef}
        align="start"
        className="py-4"
      >
        Assinaturas
      </Typography>
      <div className="w-full sm:flex justify-end sm:space-x-4 space-x-0 sm:space-y-0 space-y-4 mb-4">
        <div className="grid grid-cols-2 sm:w-4/12 w-full gap-4">
          <Input
            label="Data de criação, desde:"
            max="9999-12-31"
            name="createdAtGte"
            value={params.createdAtGte}
            borderColor={colorDef}
            focusBorderColor={colorDef}
            textColor={colorDef}
            type="date"
            w="full"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setParams({ ...params, createdAtGte: e.target.value });
            }}
          >
            {' '}
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
            borderColor={colorDef}
            focusBorderColor={colorDef}
            textColor={colorDef}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setParams({ ...params, createdAtLte: e.target.value });
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
          <SignatureExternalSortSelect
            size="md"
            w="full"
            label="Status"
            sortSelection={sortSelection}
            setSortSelection={(item: Item) => {
              setSortSelection(item);
              setParams({ ...params, ...sortMapping[item.id], page: 1 });
            }}
            color={colorDef}
          />
        </div>
      </div>

      <div className="w-full sm:h-[295px] h-56 overflow-x-auto">
        <SignatureTable params={params} setTotalObjects={setTotalObjects} />
      </div>
      <div className="items-center justify-center flex mt-4">
        <Pagination
          color={colorDef}
          page={Number(params.page)}
          setPage={(page) => setParams({ ...params, page: page })}
          totalObjects={totalObjects}
          objectsPerPage={params.perPage}
        />
      </div>
    </div>
  );
};

export default ExternalSignatures;

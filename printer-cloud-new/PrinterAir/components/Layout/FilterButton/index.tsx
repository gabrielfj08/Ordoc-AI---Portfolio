import * as React from 'react';
import router from 'next/router';
import { FilterButtonFormValues } from './types';
import FilterButton from './FilterButton';

const FilterButtonContainer = ({ queryString }) => {
  const handleSubmit = (values: FilterButtonFormValues) => {
    router.push(`/printer-air/search?${buildQueryString(values)}`);
  };

  const handleClear = () => {
    router.push(`/printer-air/search?q=*:*&start=0&rows=10`);
  };

  const buildQueryString = (values: FilterButtonFormValues): string => {
    let queryString = 'q=';

    values.searchItems.forEach(() => {
      queryString = queryString.concat('(');
    });

    values.searchItems.forEach((searchItem) => {
      if (searchItem['q.op']) {
        queryString = queryString.concat(` ${searchItem['q.op']} `);
      }

      queryString = queryString.concat(
        `${searchItem.field}:${searchItem.q ? `"${searchItem.q}"` : '*'})`
      );
    });

    queryString = queryString.concat(
      `&rows=10&sort=score desc&start=0&path=${values.path}&status=${
        values.status
      }&shared=${
        values.sharedStatus.includes('shared') ? 'true' : '*'
      }&has_link=${
        values.sharedStatus.includes('hasLink') ? 'true' : '*'
      }&created_by_id=${values.createdById}&updated_by_id=${
        values.updatedById
      }&created_at=[${
        values.createdAt.start
          ? new Date(values.createdAt.start).toISOString()
          : '*'
      } TO ${
        values.createdAt.end
          ? new Date(
              new Date(values.createdAt.end).setUTCHours(23, 59, 59, 999)
            ).toISOString()
          : '*'
      }]&updated_at=[${
        values.updatedAt.start
          ? new Date(values.updatedAt.start).toISOString()
          : '*'
      } TO ${
        values.updatedAt.end
          ? new Date(
              new Date(values.updatedAt.end).setUTCHours(23, 59, 59, 999)
            ).toISOString()
          : '*'
      }]&defType=lucene`
    );

    return queryString;
  };

  return (
    <FilterButton
      clear={handleClear}
      onSubmit={handleSubmit}
      queryString={queryString}
    />
  );
};

export default FilterButtonContainer;

import * as React from 'react';
import { SearchContainerProps } from './types';
import Search from './Search';

const SearchContainer = ({ queryString }: SearchContainerProps) => {
  return <Search queryString={queryString} />;
};

export default SearchContainer;

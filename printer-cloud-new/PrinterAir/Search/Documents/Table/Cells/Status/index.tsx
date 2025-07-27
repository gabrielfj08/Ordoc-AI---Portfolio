import * as React from 'react';
import SearchDocumentStatus from './Status';
import { SearchDocumentStatusContainerProps } from './types';

const SearchDocumentStatusContainer = ({
  document,
}: SearchDocumentStatusContainerProps) => {
  return <SearchDocumentStatus document={document} />;
};

export default SearchDocumentStatusContainer;

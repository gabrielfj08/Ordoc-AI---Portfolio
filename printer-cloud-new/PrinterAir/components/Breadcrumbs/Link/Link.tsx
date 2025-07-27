import * as React from 'react';
import Link from 'next/link';
import { BreadcrumbsLinkProps } from './types';

const BreadcrumbsLink = ({ href, children }: BreadcrumbsLinkProps) => {
  return (
    <Link href={href}>
      <a>{children}</a>
    </Link>
  );
};

export default BreadcrumbsLink;

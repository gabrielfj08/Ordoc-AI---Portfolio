import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useSession } from '../../../../hooks';
import { DirectoryService } from '../../../../services/printer-air';
import { getSubdomain } from '../../../../utils';
import { BreadcrumbsLinkContainerProps } from './types';
import BreadcrumbsSkeleton from './Skeleton';
import BreadcrumbsError from './Error';
import BreadcrumbsLink from './Link';

const BreadcrumbsLinkContainer = ({
  children,
  path,
}: BreadcrumbsLinkContainerProps) => {
  const { token } = useAuth();
  const { session } = useSession();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['directories', { path, token }],
    queryFn: () =>
      DirectoryService.index(token, getSubdomain(), session.organization.id, {
        path,
      }),
  });

  if (isError) return <BreadcrumbsError />;

  if (isLoading) return <BreadcrumbsSkeleton />;

  if (data.directories.length !== 1) {
    return <BreadcrumbsLink href="#">{children}</BreadcrumbsLink>;
  }

  const directory = data.directories[0];

  return (
    <BreadcrumbsLink
      href={`/printer-air/my-air/organizations/${directory.organizationId}/directories/${directory.id}?directoriesPage=1&directoriesOrder=name&directoriesDirection=asc&documentsPage=1&documentsOrder=original_filename&documentsDirection=asc`}
    >
      {children}
    </BreadcrumbsLink>
  );
};

export default BreadcrumbsLinkContainer;

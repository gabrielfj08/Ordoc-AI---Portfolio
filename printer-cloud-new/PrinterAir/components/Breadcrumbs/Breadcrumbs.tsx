import * as React from 'react';
import { Menu } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { listPaths } from './utils';
import { BreadcrumbsProps } from './types';
import BreadcrumbsLink from './Link';

const Breadcrumbs = ({ path }: BreadcrumbsProps) => {
  const breadcrumbPaths: Array<string> = listPaths(path);

  const basePath: string = breadcrumbPaths[0];

  const collapsedPaths: Array<string> = breadcrumbPaths.slice(
    1,
    breadcrumbPaths.length - 2
  );

  const visiblePaths: Array<string> =
    breadcrumbPaths.length > 3
      ? breadcrumbPaths.slice(
          breadcrumbPaths.length - 2,
          breadcrumbPaths.length
        )
      : breadcrumbPaths.slice(1, breadcrumbPaths.length);

  return (
    <div className="flex items-center gap-5">
      <div className="flex items-center gap-5">
        <BreadcrumbsLink path={basePath}>
          <Typography variant="title2" color="darkGray" family="robotoMedium">
            {basePath.split('/')[1]}
          </Typography>
        </BreadcrumbsLink>
        <Menu className="flex flex-col relative" as="div">
          <Menu.Button
            className={collapsedPaths.length > 0 ? 'flex gap-5' : 'hidden'}
          >
            <Icon
              name="up"
              alt="menu"
              color="darkGray"
              className="rotate-90"
              stroke
            />
            <Icon
              name="dotMenu"
              alt="menu"
              color="darkGray"
              className="rotate-90"
              stroke
            />
          </Menu.Button>
          <Menu.Items className="absolute top-10 bg-white z-20 rounded-md shadow-default border border-lightGray">
            {collapsedPaths.map((collapsedPath) => (
              <Menu.Item key={collapsedPath}>
                {({ active }) => (
                  <div
                    className={`rounded-md ${
                      active ? 'bg-blue/5' : 'bg-white'
                    }`}
                  >
                    <BreadcrumbsLink path={collapsedPath}>
                      <Typography
                        variant="body"
                        className="px-5 py-2 max-w-[30vw] truncate"
                        color="darkGray"
                      >
                        {collapsedPath.split('/').pop()}
                      </Typography>
                    </BreadcrumbsLink>
                  </div>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>
        {visiblePaths.map((visiblePath: string) => (
          <React.Fragment key={visiblePath}>
            <Icon
              name="up"
              alt="menu"
              color="darkGray"
              className="rotate-90"
              stroke
            />
            <BreadcrumbsLink path={visiblePath} key={visiblePath}>
              <Typography
                variant="title2"
                color="darkGray"
                family="robotoMedium"
                className="max-w-[20vw] truncate"
              >
                {visiblePath.split('/').pop()}
              </Typography>
            </BreadcrumbsLink>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumbs;

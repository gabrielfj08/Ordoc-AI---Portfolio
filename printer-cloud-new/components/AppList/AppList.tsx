import * as React from 'react';
import { Icon } from 'printer-ui';

export interface AppListProps {
  className?: string;
  children: React.ReactNode;
}

const AppList = ({ className: cn, children }: AppListProps) => {
  const className = `${cn} flex space-x-4`;

  return <div className={className}>{children}</div>;
};

//eslint-disable-next-line react/display-name
AppList.Air = () => {
  return (
    <Icon
      alt="air"
      name="air"
      color="white"
      stroke
      bgColor="red"
      bgStyle="cornerRounded"
    />
  );
};

//eslint-disable-next-line react/display-name
AppList.Flow = () => {
  return (
    <Icon
      alt="flow"
      name="flow"
      color="white"
      stroke
      bgColor="yellow"
      bgStyle="cornerRounded"
    />
  );
};

//eslint-disable-next-line react/display-name
AppList.Cloud = () => {
  return (
    <Icon
      alt="cloud"
      name="cloud"
      color="white"
      stroke
      bgColor="blue"
      bgStyle="cornerRounded"
    />
  );
};

export default AppList;

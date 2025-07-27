import * as React from 'react';
import {
  ExternalSessionProvider,
  useExternalSession,
  useSession,
} from '../../../hooks';
import { LayoutContainerProps } from './types';
import SkeletonLayout from './Skeleton';
import Layout from './Layout';

const LayoutContainer = ({
  children,
  internal,
  title,
  subtitle,
  icon,
  onClick,
}: LayoutContainerProps) => {
  const { externalSession } = useExternalSession();
  const { session, themeColor } = useSession();

  if (!externalSession.user) return <SkeletonLayout />;

  return (
    <Layout
      onClick={onClick}
      userName={externalSession.user.name}
      imageUrl={session.organization?.theme?.imageUrl}
      theme={themeColor}
      imageLogo={session.organization?.logoUrl}
      backgroundImg={session.organization?.theme?.backgroundUrl}
      internal={internal}
      title={title}
      subtitle={subtitle}
      icon={icon}
    >
      <div className="max-h-full">{children}</div>
    </Layout>
  );
};

const LayoutContainerWithExternalSessionProvider = (
  props: LayoutContainerProps
) => {
  return (
    <ExternalSessionProvider>
      <LayoutContainer {...props} />
    </ExternalSessionProvider>
  );
};

export default LayoutContainerWithExternalSessionProvider;

import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../hooks';
import { HomeProps } from './types';
import OrganizationFooter from './OrganizationFooter';
import Cards from './Cards';

const Home = ({ reportId }: HomeProps) => {
  const { themeColor } = useSession();

  return (
    <main className="lg:mr-10 lg:ml-20 mx-6 pt-5 lg:pt-0">
      <Typography variant="headline4" family="jakartaBold" color={themeColor}>
        Home
      </Typography>
      <Cards reportId={reportId} />
      <div
        className={`${
          window.innerHeight < 809 ? 'lg:block' : 'lg:pl-44 lg:fixed'
        }  mb-7 inset-x-0 bottom-6`}
      >
        <OrganizationFooter />
      </div>
    </main>
  );
};

export default Home;

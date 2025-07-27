import * as React from 'react';
import { Typography } from 'printer-ui';
import { HomeProps } from './types';
import Cookies from '../../Cookies';
import AppsContainer from '../../PrinterCloud/Apps/AppsContainer';

const Home = ({ organizations }: HomeProps) => {
  return (
    <>
      <main>
        <div className="sm:hidden grid justify-items-center space-y-8">
          <Typography
            variant="title1"
            family="robotoBold"
            align="center"
            className="mx-12"
          >
            Clique nos aplicativos abaixo para acessar
          </Typography>
          <AppsContainer organizations={organizations} />
        </div>
        <div className="hidden sm:flex">
          <AppsContainer organizations={organizations} />
        </div>
        <Cookies />
      </main>
    </>
  );
};

export default Home;

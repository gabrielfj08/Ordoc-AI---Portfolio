import * as React from 'react';
import { Typography } from 'printer-ui';
import { DecreeProps } from './types';
import AppBar from '../../../components/AppBar';
import { FooterLink } from '../../../components/Footer/Footer';

const Decree = ({ decree }: DecreeProps) => {
  return (
    <div className="w-full">
      <AppBar onClick={() => {}} />
      <div className="flex flex-col items-center h-screen justify-between py-10">
        <div>
          <Typography
            variant="title5"
            family="avenir"
            className="pt-28"
            align="center"
          >
            Publicação
          </Typography>
          <Typography variant="title2" align="center" family="avenir">
            Por meio deste, fica definido que:
          </Typography>
        </div>
        <Typography family="avenir" className="w-8/12">
          {decree.body}
        </Typography>
        <div className="flex space-x-11">
          <FooterLink href={decree.decreeUrl}>Decreto</FooterLink>

          {decree.lawUrl && <FooterLink href={decree.lawUrl}>Lei</FooterLink>}
        </div>
      </div>
    </div>
  );
};

export default Decree;

import * as React from 'react';
import { Typography } from 'printer-ui';
import { ShowAddressProps } from './types';
import { postalCodeMask } from '../../../../../utils';

const ShowAddress = ({ requester }: ShowAddressProps) => {
  return (
    <div className="w-full">
      <div className="w-10/12 px-4 h-full pr-2 pb-2 rounded-xl border-2 border-lightGray bg-lighterGray sm:flex">
        <div className="space-y-5 w-full md:w-6/12 px-4 sm:px-0 m-2">
          <div className="flex space-x-2 pt-2">
            <Typography variant="footnote1" family="robotoBold">
              Endereço:
            </Typography>
            {requester.address ? (
              <Typography variant="footnote1">
                {requester.address.street}, {requester.address.number}
              </Typography>
            ) : null}
          </div>
          <div className="flex space-x-2">
            <Typography variant="footnote1" family="robotoBold">
              Bairro:
            </Typography>
            <Typography variant="footnote1">
              {requester.address?.neighborhood}
            </Typography>
          </div>
          <div className="flex space-x-2">
            <Typography variant="footnote1" family="robotoBold">
              Cidade:
            </Typography>
            <Typography variant="footnote1">
              {requester.address?.city}
            </Typography>
          </div>
        </div>
        <div className="space-y-5 w-full md:w-6/12 px-4 sm:px-0 m-2">
          <div className="flex space-x-2 pt-2">
            <Typography variant="footnote1" family="robotoBold">
              CEP:
            </Typography>
            <Typography variant="footnote1">
              {postalCodeMask(String(requester.address?.postalCode))}
            </Typography>
          </div>
          <div className="flex space-x-2">
            <Typography variant="footnote1" family="robotoBold">
              Complemento:
            </Typography>
            <Typography variant="footnote1" className="">
              {requester.address?.complement}
            </Typography>
          </div>
          <div className="flex space-x-2">
            <Typography variant="footnote1" family="robotoBold">
              Estado:
            </Typography>
            <Typography variant="footnote1">
              {requester.address?.state}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowAddress;

import * as React from 'react';
import { InputV3 as Input } from 'printer-ui';
import { postalCodeMask } from '../../../../utils';
import { ShowAddressExternalRequesterProfileProps } from './types';

const ShowAddressExternalRequesterProfile = ({
  externalRequester,
  color,
}: ShowAddressExternalRequesterProfileProps) => {
  return (
    <div className="w-full space-y-2">
      <div className="justify-center sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
        <div className="grid w-full space-y-2">
          <Input
            label="Cep*"
            textColor="gray"
            borderColor={color}
            styleSize="sm"
            w="full"
            name="address.postalCode"
            type="text"
            onChange={() => {}}
            value={postalCodeMask(externalRequester.address.postalCode)}
            disabled
          />
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="Endereço*"
            textColor="gray"
            borderColor={color}
            styleSize="sm"
            w="full"
            name="address.street"
            type="text"
            onChange={() => {}}
            value={externalRequester.address.street}
            disabled
          />
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="Número*"
            textColor="gray"
            borderColor={color}
            styleSize="sm"
            w="full"
            name="address.number"
            type="text"
            onChange={() => {}}
            value={externalRequester.address.number}
            disabled
          />
        </div>
      </div>
      <div className="justify-center sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
        <div className="grid w-full space-y-2">
          <Input
            label="Complemento"
            textColor="gray"
            borderColor={color}
            styleSize="sm"
            w="full"
            name="address.complement"
            type="text"
            onChange={() => {}}
            value={String(externalRequester.address.complement)}
            disabled
          />
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="Bairro*"
            textColor="gray"
            borderColor={color}
            styleSize="sm"
            w="full"
            name="address.neighborhood"
            type="text"
            onChange={() => {}}
            value={externalRequester.address.neighborhood}
            disabled
          />
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="Cidade*"
            textColor="gray"
            borderColor={color}
            styleSize="sm"
            w="full"
            name="address.city"
            type="text"
            onChange={() => {}}
            value={externalRequester.address.city}
            disabled
          />
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="Estado*"
            textColor="gray"
            borderColor={color}
            styleSize="sm"
            w="full"
            name="address.state"
            type="text"
            placeholder="Ex.: PR"
            onChange={() => {}}
            value={externalRequester.address.state}
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default ShowAddressExternalRequesterProfile;

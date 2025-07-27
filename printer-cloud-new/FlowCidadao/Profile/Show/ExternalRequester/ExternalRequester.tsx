import * as React from 'react';
import { InputV3 as Input } from 'printer-ui';
import { cpfCnpjMask, phoneNumberMask } from '../../../../utils';
import { ShowExternalRequesterProfileProps } from './types';

const ShowExternalRequesterProfile = ({
  externalRequester,
  color,
}: ShowExternalRequesterProfileProps) => {
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-2">
        <Input
          label="Nome ou razão social*"
          textColor="gray"
          borderColor={color}
          styleSize="sm"
          w="full"
          name="name"
          type="text"
          onChange={() => {}}
          value={externalRequester.name}
          disabled
        />
      </div>
      <div className="justify-center sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
        <div className="grid w-full space-y-2">
          <Input
            label="CPF ou CNPJ*"
            textColor="gray"
            borderColor={color}
            styleSize="sm"
            maxLength={18}
            w="full"
            name="cpfCnpj"
            type="text"
            onChange={() => {}}
            value={cpfCnpjMask(externalRequester.cpfCnpj)}
            disabled
          />
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="Nascimento ou data de abertura de sua empresa*"
            textColor="gray"
            borderColor={color}
            styleSize="sm"
            w="full"
            name="birthDate"
            type="date"
            onChange={() => {}}
            value={externalRequester.birthDate}
            disabled
          />
        </div>
      </div>
      <div className="justify-center sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
        <div className="grid w-full space-y-2">
          <Input
            label="E-mail primário*"
            textColor="gray"
            borderColor={color}
            styleSize="sm"
            w="full"
            name="email"
            type="email"
            onChange={() => {}}
            value={externalRequester.email}
            disabled
          />
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="E-mail secundário"
            textColor="gray"
            borderColor={color}
            styleSize="sm"
            w="full"
            name="optionalEmail"
            type="email"
            onChange={() => {}}
            value={String(externalRequester.optionalEmail)}
            disabled
          />
        </div>
      </div>
      <div className="justify-center sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
        <div className="grid w-full space-y-2">
          <Input
            label="Celular*"
            textColor="gray"
            borderColor={color}
            size={11}
            styleSize="sm"
            w="full"
            name="phone"
            type="text"
            placeholder="(00) 00000-0000"
            onChange={() => {}}
            value={phoneNumberMask(externalRequester.phone)}
            disabled
          />
        </div>
        <div className="grid w-full space-y-2">
          <Input
            label="Telefone fixo"
            textColor="gray"
            borderColor={color}
            styleSize="sm"
            w="full"
            name="optionalPhone"
            type="text"
            onChange={() => {}}
            value={phoneNumberMask(externalRequester.optionalPhone)}
            disabled
          />
        </div>
      </div>
      <div className="justify-center space-y-2">
        <Input
          label="Profissão ou atividade"
          textColor="gray"
          borderColor={color}
          styleSize="sm"
          w="full"
          name="occupation"
          type="text"
          onChange={() => {}}
          value={externalRequester.occupation}
          disabled
        />
      </div>
    </div>
  );
};

export default ShowExternalRequesterProfile;

import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { ShowRequesterProps } from './types';
import { cpfCnpjMask, phoneNumberMask } from '../../../../../utils';
import { getRequesterType } from '../../../../../utils/getRequesterType';
import { RequesterType } from '../../../../constants';

const ShowRequester = ({ requester }: ShowRequesterProps) => {
  return (
    <div className="w-full">
      <div className="w-10/12 px-4 h-full pr-2 pb-2 rounded-xl border-2 border-lightGray bg-lighterGray sm:flex">
        <div className="space-y-5 w-full md:w-6/12 px-4 sm:px-0 m-2">
          <div className="flex space-x-2 items-center h-4">
            <Typography variant="footnote1" family="robotoBold">
              Tipo do solicitante:
            </Typography>
            <Typography variant="footnote1">
              {getRequesterType(requester.type) === RequesterType.external
                ? 'Externo'
                : RequesterType.internal
                ? 'Interno'
                : null}
            </Typography>
            <Icon
              alt="icon-type"
              name={
                getRequesterType(requester.type) === 'ExternalRequester'
                  ? 'external'
                  : requester.type === 'InternalRequester'
                  ? 'internal'
                  : 'internal'
              }
              color={
                getRequesterType(requester.type) === 'ExternalRequester'
                  ? 'orange'
                  : requester.type === 'InternalRequester'
                  ? 'black'
                  : 'black'
              }
              stroke
              fill
            />
          </div>
          <div className="flex space-x-2">
            <Typography variant="footnote1" family="robotoBold">
              Nome/Razão Social:
            </Typography>
            <Typography variant="footnote1">{requester.name}</Typography>
          </div>
          <div className="flex space-x-2">
            <Typography variant="footnote1" family="robotoBold">
              Telefone celular:
            </Typography>
            <Typography variant="footnote1">
              {phoneNumberMask(requester.phone)}
            </Typography>
          </div>
          <div className="flex space-x-2">
            <Typography variant="footnote1" family="robotoBold">
              Telefone fixo:
            </Typography>
            <Typography variant="footnote1">
              {phoneNumberMask(String(requester.optionalPhone))}
            </Typography>
          </div>
          <div className="flex space-x-2">
            <Typography variant="footnote1" family="robotoBold">
              Profissão/Atividade:
            </Typography>
            <Typography variant="footnote1">{requester.occupation}</Typography>
          </div>
        </div>
        <div className="space-y-5 w-full pr-2 md:w-6/12 px-4 sm:px-0 m-2">
          <div className="flex space-x-2 pt-2">
            <Typography variant="footnote1" family="robotoBold">
              CPF/CNPJ:
            </Typography>
            <Typography variant="footnote1">
              {cpfCnpjMask(String(requester.cpfCnpj))}
            </Typography>
          </div>
          <div className="flex space-x-2 truncate">
            <Typography variant="footnote1" family="robotoBold">
              Email principal:
            </Typography>
            <Typography variant="footnote1" className="truncate">
              {requester.email}
            </Typography>
          </div>
          <div className="flex space-x-2 truncate">
            <Typography variant="footnote1" family="robotoBold">
              Email secundário:
            </Typography>
            <Typography variant="footnote1" className="truncate">
              {requester.optionalEmail}
            </Typography>
          </div>
          <div className="flex space-x-2 truncate">
            <Typography variant="footnote1" family="robotoBold">
              Data de nascimento/Abertura:
            </Typography>
            {requester.birthDate !== null && (
              <Typography variant="footnote1" className="truncate">
                {new Date(Date.parse(requester.birthDate)).toLocaleDateString(
                  'pt-br'
                )}
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowRequester;

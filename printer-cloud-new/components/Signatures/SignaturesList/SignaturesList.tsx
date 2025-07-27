import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { SignaturesListProps } from '../types';

const SignaturesList = ({ signatures }: SignaturesListProps) => {
  if (!signatures.length)
    return (
      <div className="w-full flex justify-center items-center space-x-2 pt-20">
        <Icon alt="info" name="info" stroke w={26} h={26} color="gray" />
        <Typography variant="footnote1" color="gray">
          Nenhuma assinatura encontrada.
        </Typography>
      </div>
    );

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col items-center sm:flex-row sm:flex-wrap gap-6 justify-center pb-10 w-full max-w-[1249px]">
        {signatures
          .filter((signature) => signature.status === 'signed')
          .map((signature) => (
            <div
              key={signature.id}
              className="min-h-[266px] border-2 border-yellow p-5 rounded-2xl w-full sm:w-[384px]"
            >
              <div className=" w-full relative">
                <Icon
                  alt=""
                  name="flow"
                  color="yellow"
                  stroke
                  className="absolute -right-3 -top-3 opacity-50"
                  h={75}
                  w={75}
                />
              </div>
              <div className=" space-y-5">
                <Typography variant="headline" family="robotoBold">
                  ASSINATURA VERIFICADA
                </Typography>
                <div className="space-y-2">
                  <Typography variant="footnote1">Assinado por</Typography>
                  <Typography
                    variant="footnote1"
                    family="robotoMedium"
                    className="uppercase line-clamp-2"
                  >
                    {signature.requester.name}
                  </Typography>
                </div>
                <div className="space-y-2">
                  <Typography variant="footnote1">Assinado em</Typography>
                  <Typography variant="footnote1" family="robotoMedium">
                    {new Intl.DateTimeFormat('pt-BR', {
                      dateStyle: 'short',
                    }).format(new Date(signature.updatedAt))}
                    , às{' '}
                    {new Intl.DateTimeFormat('pt-BR', {
                      timeStyle: 'medium',
                    }).format(new Date(signature.updatedAt))}
                  </Typography>
                </div>
                <div className="space-y-2">
                  <Typography variant="footnote1">
                    Código de verificação
                  </Typography>
                  <Typography variant="footnote1" family="robotoMedium">
                    {signature.token}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SignaturesList;

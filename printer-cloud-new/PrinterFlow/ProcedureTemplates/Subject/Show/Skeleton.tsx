import * as React from 'react';
import { Skeleton, Switch, Typography } from 'printer-ui';

const ShowSubjectSkeleton = () => {
  return (
    <div className="w-full mb-12">
      <div className="mt-6 sm:w-6/12 w-full px-4">
        <Typography variant="footnote1" family="robotoMedium" className="py-4">
          Nome do assunto:*
        </Typography>
        <Skeleton w="full" h={8} rounded="lg" />
        <Typography variant="footnote1" family="robotoMedium" className="py-4">
          Grupo responsável:*
        </Typography>
        <Skeleton w="full" h={8} rounded="lg" />
        <Typography variant="footnote1" family="robotoMedium" className="py-4">
          Visualização de assunto:
        </Typography>
        <div className="flex space-x-6">
          <div className="flex space-x-2">
            <input
              type="checkbox"
              id="internal"
              name="internal"
              checked={false}
              disabled
            />
            <label htmlFor="internal" className="cursor-pointer">
              <Typography
                variant="footnote1"
                family="robotoMedium"
                className="space-x-2"
                color="gray"
              >
                Interno
              </Typography>
            </label>
          </div>
          <div className="flex space-x-2">
            <input
              type="checkbox"
              id="external"
              name="external"
              checked={false}
              disabled
            />
            <label htmlFor="external" className="cursor-pointer">
              <Typography
                variant="footnote1"
                color="gray"
                family="robotoMedium"
              >
                Externo
              </Typography>
            </label>
          </div>
        </div>
        <Typography variant="footnote1" family="robotoMedium" className="py-4">
          Status do assunto:
        </Typography>
        <div className="flex w-44 justify-between items-center">
          <Typography variant="footnote1" color="gray" family="robotoMedium">
            Inativo
          </Typography>
          <Switch name="switch" checked={true} />
          <Typography
            variant="footnote1"
            family="robotoMedium"
            className="pl-6"
            color="gray"
          >
            Ativo
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ShowSubjectSkeleton;

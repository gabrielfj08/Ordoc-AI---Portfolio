import * as React from 'react';
import { Skeleton, Typography } from 'printer-ui';

const NewSubjectSkeleton = () => {
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
      </div>
    </div>
  );
};

export default NewSubjectSkeleton;

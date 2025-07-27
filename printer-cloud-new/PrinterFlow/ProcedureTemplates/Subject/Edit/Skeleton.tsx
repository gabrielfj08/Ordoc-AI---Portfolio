import * as React from 'react';
import { Skeleton, Typography } from 'printer-ui';

const EditSubjectSkeleton = () => {
  return (
    <div className="w-full mb-12">
      <div className="my-6 sm:w-6/12 w-full px-4">
        <Typography variant="footnote1" family="robotoMedium" className="py-4">
          Nome do assunto:*
        </Typography>
        <Skeleton w="full" h={10} rounded="md" />
        <Typography variant="footnote1" family="robotoMedium" className="py-4">
          Grupo responsável:*
        </Typography>
        <Skeleton w="full" h={10} rounded="md" />
        <Typography variant="footnote1" family="robotoMedium" className="py-4">
          Visualização de assunto:
        </Typography>
        <div className="flex space-x-6 mb-4">
          <div className="flex space-x-2">
            <input type="checkbox" value="internal" checked disabled />
            <label htmlFor="internal" className="cursor-pointer">
              <Typography
                variant="footnote1"
                family="robotoMedium"
                className="space-x-2"
              >
                Interno
              </Typography>
            </label>
          </div>
          <div className="flex space-x-2">
            <input type="checkbox" value="external" disabled />
            <label htmlFor="external" className="cursor-pointer">
              <Typography variant="footnote1" family="robotoMedium">
                Externo
              </Typography>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSubjectSkeleton;

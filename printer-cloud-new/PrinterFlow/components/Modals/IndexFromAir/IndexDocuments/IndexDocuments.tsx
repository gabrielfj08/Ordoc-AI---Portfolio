import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { IndexDocumentsFromAirProps } from './types';

const IndexDocumentsFromAir = ({
  documents,
  formik,
}: IndexDocumentsFromAirProps) => {
  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <label
          htmlFor={document.originalFilename}
          className="flex space-x-2 items-center cursor-pointer"
        >
          <input
            type="checkbox"
            name="taskDocument"
            id={document.originalFilename}
            onChange={(e) => {
              e.target.checked
                ? formik.setFieldValue('taskDocuments', [
                    ...formik.values.taskDocuments,
                    {
                      source: 'printer_air',
                      name: document.originalFilename,
                      key: document.prn,
                    },
                  ])
                : formik.setFieldValue(
                    'taskDocuments',
                    formik.values.taskDocuments.filter(
                      (item) => item.key !== document.prn
                    )
                  );
            }}
          />
          <Icon alt="document" name="fileV2" color="gray" fill w={24} h={24} />
          <Typography variant="footnote1">
            {document.originalFilename}
          </Typography>
        </label>
      ))}
    </div>
  );
};

export default IndexDocumentsFromAir;

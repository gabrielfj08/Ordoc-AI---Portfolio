'use client';

import React from 'react';
import { Field } from 'formik';
import ExternalFieldTypes from '../ExternalFieldTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalFieldsPreviewProps } from './types';
import Upload from '@/components/Procedures/FieldTypes/Upload';

const ExternalFieldsPreview = ({
  fields,
  formik,
}: ExternalFieldsPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-600">
          Prévia dos campos obrigatórios a serem preenchidos:
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {fields?.map((field, index) => (
            <ExternalFieldTypes
              key={index}
              setDisableSubmitButton={() => {}}
              disabled
              formik={formik}
              type={field.fieldType}
              fieldName={field.label}
              label={field.label}
              value={field.value}
              procedure={{} as any}
              options={field.fieldValueOptions?.map((option) => option.value) || []}
              index={index}
            />
          )) || (
            <div className="text-center text-gray-500 py-8">
              Nenhum campo adicional necessário para este procedimento.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExternalFieldsPreview;

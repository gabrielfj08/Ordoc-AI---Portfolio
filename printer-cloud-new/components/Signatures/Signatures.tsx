import * as React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, Typography } from 'printer-ui';
import { VerifySignaturesProps } from './types';
import SignaturesList from './SignaturesList';

const VerifySignatures = ({ params, setParams }: VerifySignaturesProps) => {
  const [documentName, setDocumentName] = React.useState<string>('');
  return (
    <div className="w-full px-4 space-y-10 sm:px-28">
      <div className="flex flex-col items-center sm:px-52">
        <Typography
          variant="title5"
          family="avenir"
          className="pt-28"
          align="center"
        >
          Verificador de assinaturas
        </Typography>
        <Typography variant="headline" className="py-12" align="center">
          Abaixo encontram-se todas as assinaturas eletrônicas do documento{' '}
          <span className="font-roboto-500">{documentName}</span> autenticadas
          dentro da plataforma*. <br /> Para verificar uma assinatura em
          específico, utilize o código de verificação informado no Protocolo de
          Assinaturas, que encontra-se no final do documento assinado.
        </Typography>
        <Formik
          initialValues={{ q: '' }}
          onSubmit={(values) => {
            setParams({ ...params, q: values.q });
          }}
        >
          <Form>
            <div className="flex space-x-3">
              <Field
                type="text"
                name="q"
                placeholder="Código de verificação"
                className="rounded-lg w-full h-9 shadow-default focus:outline-none focus:bg-info/10 font-roboto-400 px-4 placeholder:italic sm:w-96"
              />
              <Button label="Buscar" color="info" type="submit" />
            </div>
            <Typography variant="caption" className="italic mt-2" color="gray">
              *Este verificador é exclusivo para documentos assinados pela
              plataforma Printer Cloud.
            </Typography>
          </Form>
        </Formik>
      </div>
      <SignaturesList params={params} setDocumentName={setDocumentName} />
    </div>
  );
};

export default VerifySignatures;

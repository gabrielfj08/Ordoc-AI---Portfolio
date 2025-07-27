import * as React from 'react';
import { Tag } from 'printer-ui';
import { SignatureStatusTagProps } from './types';
import { Signaturetatus } from '../../../constants/SignatureStatus';

const SignatureStatusTag = ({ status }: SignatureStatusTagProps) => {
  switch (status) {
    case Signaturetatus.created:
      return (
        <Tag
          label="Pendente"
          bgColor="cidOrangeLight"
          color="cidOrange"
          className="uppercase"
        />
      );
    case Signaturetatus.running:
      return (
        <Tag
          label="Assinando"
          bgColor="cidOrangeLight"
          color="white"
          className="uppercase"
        />
      );
    case Signaturetatus.signed:
      return (
        <Tag
          label="Assinado"
          bgColor="success"
          color="white"
          className="uppercase"
        />
      );
    case Signaturetatus.refused:
      return (
        <Tag
          label="Recusado"
          bgColor="error"
          color="white"
          className="uppercase"
        />
      );
    default:
      return null;
  }
};

export default SignatureStatusTag;

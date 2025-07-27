import * as React from 'react';
import { render } from '@testing-library/react';
import EditDocumentInfoForm from './EditInfoForm';
import {
  ShowDocumentAPIResponse,
  ShowDocumentCreatedBy,
} from '../../../../../../../services/printer-air/types';

const userMock: ShowDocumentCreatedBy = {
  id: 1,
  email: 'teste',
  name: 'teste',
  createdAt: 'teste',
  updatedAt: 'teste',
  phone: 'teste',
  cpf: 'teste',
  deletedAt: 'teste',
  dateOfBirth: 'teste',
  unlockTokenSentAt: 'teste',
  status: 'active',
  prn: 'teste',
};

const documentMock: ShowDocumentAPIResponse = {
  id: 1,
  originalFilename: 'teste',
  status: 'created',
  description: 'teste descrição',
  location: 'teste localização',
  directoryId: 1,
  prn: 'teste',
  path: 'teste',
  createdAt: 'teste',
  updatedAt: 'teste',
  deletedAt: 'teste',
  url: 'teste',
  downloadUrl: 'teste',
  content: 'teste',
  size: 'teste',
  byteSize: 1,
  createdBy: userMock,
  updatedBy: null,
  directory: { name: 'teste' },
};

describe('EditDocumentInfoForm', () => {
  describe('Renders the correct fields', () => {
    const onCloseFnMock = jest.fn();
    const onSubmitFnMock = jest.fn();

    it('renders file name input', () => {
      const editDocumentInfoForm = render(
        <EditDocumentInfoForm
          onClose={onCloseFnMock}
          onSubmit={onSubmitFnMock}
          document={documentMock}
        />
      );

      const { getByText } = editDocumentInfoForm;

      expect(getByText('Nome do arquivo:')).toBeInTheDocument();
    });

    it('renders file location input', () => {
      const editDocumentInfoForm = render(
        <EditDocumentInfoForm
          onClose={onCloseFnMock}
          onSubmit={onSubmitFnMock}
          document={documentMock}
        />
      );

      const { getByText } = editDocumentInfoForm;

      expect(getByText('Localização:')).toBeInTheDocument();
    });

    it('renders file description input', () => {
      const editDocumentInfoForm = render(
        <EditDocumentInfoForm
          onClose={onCloseFnMock}
          onSubmit={onSubmitFnMock}
          document={documentMock}
        />
      );

      const { getByText } = editDocumentInfoForm;

      expect(getByText('Descrição:')).toBeInTheDocument();
    });
  });

  describe('Renders the buttons', () => {
    const onCloseFnMock = jest.fn();
    const onSubmitFnMock = jest.fn();

    it('renders save button', () => {
      const editDocumentInfoForm = render(
        <EditDocumentInfoForm
          onClose={onCloseFnMock}
          onSubmit={onSubmitFnMock}
          document={documentMock}
        />
      );

      const { getByText } = editDocumentInfoForm;

      expect(getByText('Salvar alterações')).toBeInTheDocument();
    });

    it('renders cancel button', () => {
      const editDocumentInfoForm = render(
        <EditDocumentInfoForm
          onClose={onCloseFnMock}
          onSubmit={onSubmitFnMock}
          document={documentMock}
        />
      );

      const { getByText } = editDocumentInfoForm;

      expect(getByText('Cancelar')).toBeInTheDocument();
    });
  });
});

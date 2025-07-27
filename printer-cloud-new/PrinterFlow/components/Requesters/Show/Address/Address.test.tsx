import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import { ShowRequester } from '../../../../../services/printer-flow/types';
import ShowAddress from './Address';

describe('Address data', () => {
  const requester: ShowRequester = {
    id: 1,
    name: 'Katia Werner',
    organizationId: 1,
    parentGroupId: null,
    cpfCnpj: '035.117.359-58',
    prn: 'prn:printer_flow:04916444000122:requester_external/11404702997',
    code: null,
    email: 'katia@printerdobrasil.com.br',
    optionalEmail: 'katia.werner@printerdobrasil.com.br',
    type: 'InternalRequester',
    status: 'active',
    phone: '41997570204',
    optionalPhone: null,
    occupation: 'Desenvolvedora FrontEnd',
    birthDate: '21/01/1995',
    createdAt: '2023-02-22T11:38:29.395Z',
    updatedAt: '2023-02-22T19:10:33.536Z',
    address: {
      id: 1,
      street: 'Rua Arthur Leme',
      number: 327,
      complement: 'Printer do Brasil',
      postalCode: '83.410-360',
      city: 'Curitiba',
      state: 'Paraná',
      neighborhood: 'Bacacheri',
      createdAt: '',
      updatedAt: '',
      deletedAt: '',
    },
    user: null,
  };

  it('renders the content:', () => {
    act(() => {
      render(<ShowAddress requester={requester} />);
    });

    expect(screen.getByText('Endereço:')).toBeInTheDocument();
  });
});

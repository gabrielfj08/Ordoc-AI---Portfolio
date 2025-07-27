import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MeAPIResponse } from '../../../../services/types';
import Edit from './Edit';

const user: MeAPIResponse = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  changedPassword: true,
  cpf: '08419665320',
  dateOfBirth: '2002-12-19',
  avatarUrl: 'https://example.com',
  phone: '41999999999',
  status: 'active',
  prn: 'prn:printer_cloud:1234567890:user/john.doe',
  username: 'john.doe',
  registrationNumber: '1234567890',
  createdAt: '2022-12-19T16:35:00.000Z',
  updatedAt: '2022-12-19T16:35:00.000Z',
  internalRequester: {
    id: 1,
    name: 'Jucelino da Silva',
    organizationId: 4,
    parentGroupId: null,
    cpfCnpj: null,
    prn: 'prn:printer_flow:04916444000122:Protocolo/1/2023',
    code: 12015,
    email: 'judasilva@gmail.com',
    optionalEmail: '',
    type: 'InternalRequester',
    status: 'active',
    phone: '419880701540',
    optionalPhone: '',
    occupation: '',
    birthDate: '21/04/2000',
    createdAt: '2023-04-12T12:37:05.076Z',
    updatedAt: '2023-04-12T12:37:05.076Z',
  },
};

describe('Edit', () => {
  it("renders the user's name", () => {
    const handleSubmit = jest.fn();

    const { getByDisplayValue } = render(
      <Edit user={user} onSubmit={handleSubmit} />
    );

    expect(getByDisplayValue(user.name)).toBeInTheDocument();
  });

  it("renders the user's cpf", () => {
    const handleSubmit = jest.fn();

    const { getByDisplayValue } = render(
      <Edit user={user} onSubmit={handleSubmit} />
    );

    expect(getByDisplayValue('084.196.653-20')).toBeInTheDocument();
  });

  it("renders the user's date of birth", () => {
    const handleSubmit = jest.fn();

    const { getByDisplayValue } = render(
      <Edit user={user} onSubmit={handleSubmit} />
    );

    expect(getByDisplayValue(user.dateOfBirth)).toBeInTheDocument();
  });

  it("renders the user's email", () => {
    const handleSubmit = jest.fn();

    const { getByDisplayValue } = render(
      <Edit user={user} onSubmit={handleSubmit} />
    );

    expect(getByDisplayValue(user.email)).toBeInTheDocument();
  });

  it("renders the user's phone", () => {
    const handleSubmit = jest.fn();

    const { getByDisplayValue } = render(
      <Edit user={user} onSubmit={handleSubmit} />
    );

    expect(getByDisplayValue('(41)99999-9999')).toBeInTheDocument();
  });

  describe('when submit button is clicked', () => {
    it('calls the form onSumit callback', () => {
      const handleSubmit = jest.fn();

      const { getByText } = render(
        <Edit user={user} onSubmit={handleSubmit} />
      );

      const submitButton = getByText(/salvar alterações/i);

      fireEvent.click(submitButton);

      waitFor(() => expect(handleSubmit).toHaveBeenCalled());
    });
  });
});

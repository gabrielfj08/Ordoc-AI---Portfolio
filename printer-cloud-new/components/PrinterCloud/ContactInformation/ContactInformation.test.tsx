import * as React from 'react';
import { render } from '@testing-library/react';

import ContactInformation from './ContactInformation';

describe('Contact Information field', () => {
  it('renders the title', () => {
    const contactInformation = render(<ContactInformation />);

    const { getByText } = contactInformation;
    contactInformation;
    expect(getByText('Informações do fabricante')).toBeInTheDocument();
  });

  it('renders company name', () => {
    const contactInformation = render(<ContactInformation />);

    const { getByText } = contactInformation;

    expect(
      getByText('PRINTER DO BRASIL TECNOLOGIA DA INFORMAÇÃO LTDA')
    ).toBeInTheDocument();
  });

  it('renders company CNPJ', () => {
    const contactInformation = render(<ContactInformation />);

    const { getByText } = contactInformation;

    expect(getByText('04.916.444/0001-22')).toBeInTheDocument();
  });

  it('renders company site', () => {
    const contactInformation = render(<ContactInformation />);

    const { getByRole } = contactInformation;

    expect(
      getByRole('link', { name: 'www.printerdobrasil.com.br' })
    ).toBeInTheDocument();
  });

  it('renders company email', () => {
    const contactInformation = render(<ContactInformation />);

    const { getByText } = contactInformation;

    expect(getByText('contato@printerdobrasil.com.br')).toBeInTheDocument();
  });

  it('renders company phone', () => {
    const contactInformation = render(<ContactInformation />);

    const { getByText } = contactInformation;

    expect(getByText('(41)3387-8613')).toBeInTheDocument();
  });

  it('renders company whatsApp', () => {
    const contactInformation = render(<ContactInformation />);

    const { getByText } = contactInformation;

    expect(getByText('(41)98400-0929')).toBeInTheDocument();
  });
});

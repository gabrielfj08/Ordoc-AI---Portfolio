import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import AttachToUserGroups from './AttachToUserGroups';

describe('AttachToUserGroups', () => {
  it('renders modal title', async () => {
    const handleSubmit = jest.fn();

    await act(() => {
      render(
        <AttachToUserGroups
          userGroups={[]}
          currentUserGroups={[]}
          onSubmit={handleSubmit}
        />
      );
    });

    expect(
      screen.getByText('Adicionar grupos à permissão')
    ).toBeInTheDocument();
  });

  it('renders modal content', async () => {
    const handleSubmit = jest.fn();

    await act(() => {
      render(
        <AttachToUserGroups
          userGroups={[]}
          currentUserGroups={[]}
          onSubmit={handleSubmit}
        />
      );
    });

    expect(
      screen.getByText('Selecione os grupos desejados:')
    ).toBeInTheDocument();
  });

  it('renders MultipleSelect', async () => {
    const handleSubmit = jest.fn();

    await act(() => {
      render(
        <AttachToUserGroups
          userGroups={[]}
          currentUserGroups={[]}
          onSubmit={handleSubmit}
        />
      );
    });

    expect(screen.getByText('Selecione os grupos')).toBeInTheDocument();
  });

  it('renders add button', async () => {
    const handleSubmit = jest.fn();

    await act(() => {
      render(
        <AttachToUserGroups
          userGroups={[]}
          currentUserGroups={[]}
          onSubmit={handleSubmit}
        />
      );
    });

    expect(screen.getByText('Adicionar grupos')).toBeInTheDocument();
  });
});

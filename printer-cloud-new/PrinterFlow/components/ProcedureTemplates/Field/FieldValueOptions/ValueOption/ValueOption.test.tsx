import * as React from 'react';
import { render } from '@testing-library/react';
import ValueOption from './ValueOption';
import { BaseFieldValueOption } from '../../../../../../services/printer-flow/types';

describe('ValueOption', () => {
  it('renders the field option value', () => {
    const handleSubmit = jest.fn();
    const testValueOption: BaseFieldValueOption = {
      id: 1,
      fieldId: 1,
      value: 'Masculino',
      createdAt: '2022-11-24T16:15:05.486Z',
      updatedAt: '2022-11-24T16:15:05.486Z',
    };

    const valueOption = render(
      <ValueOption
        onSubmit={handleSubmit}
        fieldValueOption={testValueOption}
        type={'show'}
        total={1}
      />
    );

    const { getByText } = valueOption;

    expect(getByText('Masculino')).toBeInTheDocument();
  });
});

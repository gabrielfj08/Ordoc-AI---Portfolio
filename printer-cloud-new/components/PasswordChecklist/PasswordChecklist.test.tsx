import * as React from 'react';
import { render } from '@testing-library/react';

import PasswordChecklist from './PasswordChecklist';

describe('PasswordChecklist', () => {
  describe('when password has eight or more characters', () => {
    it('returns a success message', () => {
      const passwordChecklist = render(
        <PasswordChecklist password="Test@1234" />
      );
      const { getByText } = passwordChecklist;

      expect(
        getByText('* A senha deve conter no mínimo 8 caracteres;')
      ).toHaveClass('text-success');
    });
  });

  describe('when password has less than eight characters', () => {
    it('returns an error message', () => {
      const passwordChecklist = render(<PasswordChecklist password="0a" />);
      const { getByText } = passwordChecklist;

      expect(
        getByText('* A senha deve conter no mínimo 8 caracteres;')
      ).toHaveClass('text-error');
    });
  });

  describe('when password has a special character', () => {
    it('returns a success message', () => {
      const passwordChecklist = render(<PasswordChecklist password="!" />);
      const { getByText } = passwordChecklist;

      expect(
        getByText('* A senha deve conter símbolos; (ex: !@#$?)')
      ).toHaveClass('text-success');
    });
  });

  describe('when password does not have a special character', () => {
    it('returns an error message', () => {
      const passwordChecklist = render(<PasswordChecklist password="A" />);
      const { getByText } = passwordChecklist;

      expect(
        getByText('* A senha deve conter símbolos; (ex: !@#$?)')
      ).toHaveClass('text-error');
    });
  });

  describe('when password has a number', () => {
    it('returns a success message', () => {
      const passwordChecklist = render(<PasswordChecklist password="1" />);
      const { getByText } = passwordChecklist;

      expect(
        getByText('* A senha deve conter dígitos; (de 0 a 9)')
      ).toHaveClass('text-success');
    });
  });

  describe('when password does not have a number', () => {
    it('returns an error message', () => {
      const passwordChecklist = render(<PasswordChecklist password="A" />);
      const { getByText } = passwordChecklist;

      expect(
        getByText('* A senha deve conter dígitos; (de 0 a 9)')
      ).toHaveClass('text-error');
    });
  });

  describe('when password has a capital letter', () => {
    it('returns a success message', () => {
      const passwordChecklist = render(<PasswordChecklist password="Aa" />);
      const { getByText } = passwordChecklist;

      expect(
        getByText('* A senha deve conter letras maiúsculas e minúsculas.')
      ).toHaveClass('text-success');
    });
  });

  describe('when password does not have a capital letter', () => {
    it('returns an error message', () => {
      const passwordChecklist = render(<PasswordChecklist password="A" />);
      const { getByText } = passwordChecklist;

      expect(
        getByText('* A senha deve conter letras maiúsculas e minúsculas.')
      ).toHaveClass('text-error');
    });
  });
});

import { listPaths } from './listPaths';

describe('listPaths', () => {
  it('renders the list of paths', () => {
    const path = 'Meu Air/Administração/Ofícios/2022';

    expect(listPaths(path)).toEqual(['Meu Air', 'Meu Air/Administração', 'Meu Air/Administração/Ofícios', 'Meu Air/Administração/Ofícios/2022']);
  });

  describe('when path is empty string', () => {
    it('renders an empty array', () => {
      const path = '';

      expect(listPaths(path)).toEqual([]);
    });
  });

  describe('when path is a slash', () => {
    it('renders an array with a slash', () => {
      const path = '/';

      expect(listPaths(path)).toEqual(['/']);
    });
  });
});

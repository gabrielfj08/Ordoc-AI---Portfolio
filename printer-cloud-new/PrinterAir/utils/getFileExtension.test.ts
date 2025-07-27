import { getFileExtension } from './getFileExtension';

describe('getFileExtension', () => {
  it('returns the file extension', () => {
    const filename = 'file.pdf';

    expect(getFileExtension(filename)).toBe('pdf');
  })
});

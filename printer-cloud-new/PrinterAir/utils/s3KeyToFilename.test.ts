import { s3KeyToFilename } from './s3KeyToFilename';

describe('s3KeyToFilename', () => {
  it('converts S3 key to filename', () => {
    const s3Key = '/test/1234567890/Meu Air/Administração/file.png';

    expect(s3KeyToFilename(s3Key)).toBe('file.png');
  });
});

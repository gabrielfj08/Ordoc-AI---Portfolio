export const s3KeyToFilename = (s3Key: string) => {
  return s3Key.replace(/^.*[\\\/]/, '');
};

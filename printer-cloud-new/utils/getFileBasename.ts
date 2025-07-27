const getFileBasename = (basename: string) => {
  return basename.split('/').pop();
};

export default getFileBasename;

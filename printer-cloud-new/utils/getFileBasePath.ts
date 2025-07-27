const getFileBasePath = (path: string) => {
  const result = path.split('/');

  result.pop();

  return result.join('/');
};

export default getFileBasePath;

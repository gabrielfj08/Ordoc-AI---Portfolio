const removeFileExtension = (originalFilename: string) => {
  const path = require('path');

  return path.parse(originalFilename).name;
};

export default removeFileExtension;

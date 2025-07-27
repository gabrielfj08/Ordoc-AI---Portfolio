export const listPaths = (path: string) => {
  const paths: Array<string> = [];

  [...path].forEach((character, index) => {
    if (character === '/' && index > 0) {
      paths.push(path.substring(0, index));
    }

    if (index === path.length - 1) {
      paths.push(path.substring(0, index + 1));
    }
  });

  return paths;
};

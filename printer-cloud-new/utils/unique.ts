const unique = <Type>(array: Array<Type>): Array<Type> => {
  return [...new Set(array)];
};

export default unique;

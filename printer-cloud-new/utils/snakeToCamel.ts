const snakeToCamel = (snakeCaseString: string): string => {
  const words = snakeCaseString.split('_');
  const camelCaseWords = words.map((word, index) => {
    if (index === 0) {
      return word;
    }
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    return capitalized;
  });
  return camelCaseWords.join('');
};

export default snakeToCamel;

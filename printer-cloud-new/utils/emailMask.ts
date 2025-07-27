const emailMask = (email: string): any => {
  const result = email.replace(
    /(?<=^.)(.*)(?=@)/,
    (match) =>
      match.slice(0, 3) +
      '*'.repeat(Math.min(match.length - 3, 5)) +
      match.slice(-2)
  );

  return result;
};

export default emailMask;

export const generateUsername = (name: string): string => {
  if (!name) return '';

  const tokens = name.split(' ');

  if (tokens.length === 1) return name;

  return `${tokens[0]}.${tokens[tokens.length - 1]}`.toLowerCase();
};

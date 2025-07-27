export const getSignableType = (requester: string) => {
  const signableType = requester.split('::').pop();

  return signableType;
};

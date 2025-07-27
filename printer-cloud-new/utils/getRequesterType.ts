export const getRequesterType = (requester: string) => {
  const requesterType = requester.split('::').pop();

  return requesterType;
};

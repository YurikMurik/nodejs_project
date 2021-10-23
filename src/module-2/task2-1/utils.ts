export const getAutoSuggestUsers = (
  loginSubstring: string,
  limit: number = 5,
) => {};

export const isEqualsObjects = (
  obj1: Record<string, any>,
  obj2: Record<string, any>,
) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

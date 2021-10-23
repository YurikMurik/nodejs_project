export const getAutoSuggestUsers = (
  loginSubstring: string,
  limit: number = 5,
) => {};

export const isEqualsObjects = (
  obj1: Record<string, any>,
  obj2: Record<string, any>,
) => {
  const { id: id1, ...anotherDataObj1 } = obj1;
  const { id: id2, ...anotherDataObj2 } = obj2;

  return JSON.stringify(anotherDataObj1) === JSON.stringify(anotherDataObj2);
};

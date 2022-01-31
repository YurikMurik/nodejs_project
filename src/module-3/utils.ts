/* eslint-disable @typescript-eslint/no-explicit-any */
export const areEqualsObjects = (
  obj1: Record<string, any>,
  obj2: Record<string, any>
) => {
  // Delete useless ids here
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { id: id1, ...anotherDataObj1 } = obj1;
  const { id: id2, ...anotherDataObj2 } = obj2;
  /* eslint-enable */


  return JSON.stringify(anotherDataObj1) === JSON.stringify(anotherDataObj2);
};

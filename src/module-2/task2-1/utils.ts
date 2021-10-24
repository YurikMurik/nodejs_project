import { store } from "./store";

export const getAutoSuggestUsers = (
  loginSubstring: string,
  limit: number = 2,
) => {
  if (isNaN(limit)) {
    return [];
  }

  const newData = store
    .map((e) => {
      if (e.login.search(String(loginSubstring))) {
        return e;
      }
    })
    .slice(0, limit)
    .sort((a, b) => a.login.localeCompare(b.login));

  return newData;
};

export const isEqualsObjects = (
  obj1: Record<string, any>,
  obj2: Record<string, any>,
) => {
  const { id: id1, ...anotherDataObj1 } = obj1;
  const { id: id2, ...anotherDataObj2 } = obj2;

  return JSON.stringify(anotherDataObj1) === JSON.stringify(anotherDataObj2);
};

export const isAlreadyExistsItem = (login: string) =>
  Boolean(store.find((e) => e.login === login));

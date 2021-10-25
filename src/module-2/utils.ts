import { store } from "./store";
import { User } from "./types";

export const getAutoSuggestUsers = (loginSubstring: string, limit = 2) => {
  if (isNaN(limit)) {
    return [];
  }

  const newData = store
    .filter((e) => e.login.indexOf(String(loginSubstring)) !== -1)
    .slice(0, limit)
    .sort((a, b) => a.login.localeCompare(b.login));

  return newData;
};

export const isEqualsObjects = (obj1: User, obj2: User) => {
  /* eslint-disable no-unused-vars */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  // Delete useless ids here
  const { id: id1, ...anotherDataObj1 } = obj1;
  const { id: id2, ...anotherDataObj2 } = obj2;
  /* eslint-enable */

  return JSON.stringify(anotherDataObj1) === JSON.stringify(anotherDataObj2);
};

export const isAlreadyExistsItem = (login: string) =>
  Boolean(store.find((e) => e.login === login));

import { User, UserRequest } from "../types";

const store: Array<User> = [];
let counter = 0;

const getStoreData = (id: string) => {
  return store.find((e) => e.id === id);
};
const setDataToStore = (data: UserRequest) => {
  store.push({
    ...data,
    id: String(counter),
  });
  counter++;
};

const editDataStore = (data: User) => {
  const { id } = data;
  const ind = store.findIndex((e) => e.id === id);
  store[ind] = data as User;
};

export { store, setDataToStore, getStoreData, editDataStore };

export type User = {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
};

export type AddUserParams = Pick<User, "login" | "age" | "password">;

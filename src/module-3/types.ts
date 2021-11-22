export interface UserModel extends BaseUser {
  login: string;
  password: string;
  age: number;
}

export interface BaseUser {
  id?: string;
  isDeleted?: boolean;
}

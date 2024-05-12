export interface IUser {
  id?: string;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  avatar: string;
  gender: "m" | "f" | "o";
}

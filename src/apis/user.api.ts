import { AxiosResponse } from "axios";
import { http } from "../lib/axios/config";
import { IUser } from "../types/user.types";
import { IResponseApi } from "../types/response.type";
import { IApartment } from "../types/apartment.types";
import { IUpdatePassword } from "../schemas/userSchema";

export interface IProfilePost {
  userPosts: IApartment[];
  savedPosts: IApartment[];
}

export const updateUser = async (
  data: IUser | Omit<IUpdatePassword, "confirmPassword">,
  uid: string
) => {
  const res: AxiosResponse<IResponseApi<IUser>> = await http.put(
    `/users/${uid}`,
    data
  );
  return res.data;
};

export const getProfilePosts = async () => {
  const res: AxiosResponse<IResponseApi<IProfilePost>> = await http.get(
    `/users/profilePosts`
  );
  return res.data;
};

export const getNumberNewChat = async () => {
  const res: AxiosResponse<IResponseApi<{ newChat: number }>> = await http.get(
    `/users/notifications`
  );
  return res.data;
};

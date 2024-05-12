import { AxiosResponse } from "axios";
import { http } from "../lib/axios/config";
import { ILogin, IRegister } from "../schemas/registerSchema";
import { IResponseApi } from "../types/response.type";
import { IUser } from "../types/user.types";

export const registerApi = async (
  data: Partial<IRegister | "confirmPassword">
) => {
  const res: AxiosResponse<IResponseApi<IUser>> = await http.post(
    "/auth/register",
    data
  );
  return res.data;
};

export const loginApi = async (data: Partial<ILogin | "confirmPassword">) => {
  const res: AxiosResponse<IResponseApi<IUser>> = await http.post(
    "/auth/login",
    data
  );
  return res.data;
};

export const logoutApi = async () => {
  const res: AxiosResponse<IResponseApi<null>> = await http.post(
    "/auth/logout"
  );
  return res.data;
};

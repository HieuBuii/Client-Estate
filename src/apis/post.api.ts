import { AxiosResponse } from "axios";
import { http } from "../lib/axios/config";
import { IApartment } from "../types/apartment.types";
import { IResponseApi } from "../types/response.type";

export const createPost = async (data: IApartment) => {
  const res: AxiosResponse<IResponseApi<IApartment>> = await http.post(
    "/posts",
    data
  );
  return res.data;
};

export const updatePost = async (data: IApartment, postId: string) => {
  const res: AxiosResponse<IResponseApi<IApartment>> = await http.put(
    `/posts/${postId}`,
    data
  );
  return res.data;
};

export const getPost = async (id: string) => {
  const res: AxiosResponse<IResponseApi<IApartment>> = await http.get(
    `/posts/${id}`
  );
  return res.data;
};

export const getPosts = async (query: string) => {
  const res: AxiosResponse<IResponseApi<IApartment[]>> = await http.get(
    `/posts${query}`
  );
  return res.data;
};

export const savePost = async (data: { postId: string }) => {
  const res: AxiosResponse<IResponseApi<IApartment>> = await http.post(
    "/posts/save",
    data
  );
  return res.data;
};

export const deletePost = async (id: string) => {
  const res: AxiosResponse<IResponseApi<null>> = await http.delete(
    `/posts/${id}`
  );
  return res.data;
};

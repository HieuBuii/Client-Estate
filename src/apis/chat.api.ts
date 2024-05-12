import { AxiosResponse } from "axios";
import { IResponseApi } from "../types/response.type";
import { http } from "../lib/axios/config";
import { IChat } from "../types/chat.types";
import { IConversation } from "../components/Chat/Chat";

export const getChats = async (query: string) => {
  const res: AxiosResponse<IResponseApi<IChat[]>> = await http.get(
    `/chats${query}`
  );
  return res.data;
};

export const getChat = async (chatId: string) => {
  const res: AxiosResponse<IResponseApi<IChat>> = await http.get(
    `/chats/${chatId}`
  );
  return res.data;
};

export const readChat = async (chatId: string) => {
  const res: AxiosResponse<IResponseApi<IChat>> = await http.put(
    `/chats/read/${chatId}`
  );
  return res.data;
};

export const createChat = async (receiverId: string) => {
  const res: AxiosResponse<IResponseApi<IConversation>> = await http.post(
    `/chats`,
    {
      receiverId,
    }
  );
  return res.data;
};

export const updateChat = async (chatId: string) => {
  const res: AxiosResponse<IResponseApi<IConversation>> = await http.put(
    `/chats/${chatId}`
  );
  return res.data;
};

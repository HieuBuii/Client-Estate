import { AxiosResponse } from "axios";
import { IResponseApi } from "../types/response.type";
import { IMessage } from "../types/message.types";
import { http } from "../lib/axios/config";

export const createMessage = async (
  chatId: string,
  message: string,
  receiverId?: string
) => {
  const res: AxiosResponse<IResponseApi<IMessage>> = await http.post(
    `/messages/${chatId}`,
    { text: message, receiverId }
  );
  return res.data;
};

export const getMessages = async (chatId: string, page: string | number) => {
  const res: AxiosResponse<IResponseApi<IMessage[]>> = await http.get(
    `/messages/${chatId}?page=${page}`
  );
  return res.data;
};

export const updateMessage = async (
  messageId: string,
  data: {
    chatId: string;
    text?: string;
    lastMessageId?: string;
    isDeleted?: boolean;
  }
) => {
  const res: AxiosResponse<IResponseApi<IMessage>> = await http.put(
    `/messages/${messageId}`,
    data
  );
  return res.data;
};

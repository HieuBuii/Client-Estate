import { IConversation } from "../components/Chat/Chat";

export interface IMessage {
  id?: string;
  text: string;
  chatId: string;
  userId: string;
  createdAt: string;
  isDeleted: boolean;
  isUpdated: boolean;
  lastMessage?: string;
  chat?: IConversation;
}

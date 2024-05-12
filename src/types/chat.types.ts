export interface IChat {
  id?: string;
  userIDs: string[];
  seenBy: string[];
  lastMessage?: string;
  receiver: IReceiverUser;
  createdAt: Date;
  hiddenWithReceiver?: string;
  hiddenWithSender?: string;
  senderHiddenFrom?: string;
  receiverHiddenFrom?: string;
}

export interface IReceiverUser {
  avatar?: string;
  firstName: string;
  lastName: string;
  id: string;
}

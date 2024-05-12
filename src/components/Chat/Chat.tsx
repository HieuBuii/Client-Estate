import { useCallback, useContext, useEffect, useState } from "react";
import { IChat, IReceiverUser } from "../../types/chat.types";
import { AuthContext } from "../../context/AuthContext";
import { getChat, getChats, updateChat } from "../../apis/chat.api";
import { useNotificationsStore } from "../../lib/zustand/notificationsStore";
import InfiniteLoad from "../InfiniteScroll";
import defaultAvatar from "/images/default-avatar.png";
import MessageBox from "../MessageBox";
import ModalConfirm from "../Modal/Confirm";
import { toast } from "react-toastify";
import { SocketContext } from "../../context/SocketContext";
import { IMessage } from "../../types/message.types";
import { HiOutlineTrash } from "react-icons/hi";

export type IConversation = IChat & {
  receiver: IReceiverUser;
};

interface IProps {
  defaultSelected?: IConversation;
}

function Chat({ defaultSelected }: IProps) {
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const fetchNumberOfNewChat = useNotificationsStore(
    (state) => state.fetchNumberOfNewChat
  );
  const [selectedChat, setSelectedChat] = useState<IConversation | undefined>();
  const [paginate, setPaginate] = useState({ page: 1, perPage: 10 });
  const [chats, setChats] = useState<IChat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreChat, setHasMoreChat] = useState(true);
  const [openConfirmChat, setOpenConfirmChat] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteChat, setDeleteChat] = useState<IConversation | undefined>();
  const [total, setTotal] = useState(0);

  const getDataChats = useCallback(async () => {
    setIsLoading(true);
    const res = await getChats(`?page=${paginate.page}&perPage=${10}`);
    if ((total > 0 && total >= (res?.total ?? 0)) || res.data?.length === 0)
      setHasMoreChat(false);
    setTotal((prev) => prev + (res.data?.length || 0));
    setChats((prev) =>
      [...prev, ...(res.data || [])].filter(
        (chat) =>
          chat.hiddenWithReceiver !== currentUser?.id &&
          chat.hiddenWithSender !== currentUser?.id
      )
    );
    setIsLoading(false);
  }, [paginate.page, currentUser?.id, total]);

  const fetchMoreChat = useCallback(() => {
    if (isLoading) return;
    getDataChats();
    setPaginate((prev) => ({ ...prev, page: prev.page + 1 }));
  }, [getDataChats, isLoading]);

  const decreaseNumbersOfNewChat = useNotificationsStore(
    (state) => state.decrease
  );

  const handleOpenChat = async (id: string, receiver: IReceiverUser) => {
    try {
      const res = await getChat(id);
      if (!res.data?.seenBy.includes(currentUser?.id as string)) {
        decreaseNumbersOfNewChat();
        const indexOfCurrentChat = chats.findIndex((chat) => chat.id === id);
        if (indexOfCurrentChat !== -1) {
          setChats((prev) => {
            prev[indexOfCurrentChat].seenBy.push(currentUser?.id as string);
            return prev;
          });
        }
      }
      res.data &&
        setSelectedChat({
          ...res.data,
          receiver,
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteChat = (chat: IConversation) => {
    setDeleteChat(chat);
    setOpenConfirmChat(true);
  };

  const confirmDeleteChat = async () => {
    try {
      setIsDeleting(true);
      const res = await updateChat(deleteChat?.id as string);
      toast.success(res.message);
      const newChats = chats.filter((chat) => chat.id !== deleteChat?.id);
      setChats(newChats);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
      setOpenConfirmChat(false);
    }
  };

  const handleUpdateChatState = (
    chatId: string,
    lastMessage: string,
    chat?: IConversation
  ) => {
    if (chat && !chats.find((chatData) => chatData.id === chat.id)) {
      setChats((prev) => [...prev, chat]);
    } else {
      const newChats = [...chats];
      const currentChatindex = newChats.findIndex((chat) => chat.id === chatId);
      if (currentChatindex !== -1) {
        newChats[currentChatindex].lastMessage = lastMessage;
      }
      setChats(newChats);
    }
  };

  useEffect(() => {
    if (defaultSelected) {
      setSelectedChat(defaultSelected);
    }
  }, [defaultSelected]);

  useEffect(() => {
    if (socket) {
      socket.on("getMessage", (data: IMessage) => {
        const newChats = [...chats];
        const chatIndex = newChats.findIndex((chat) => chat.id === data.chatId);
        if (chatIndex === -1) {
          setChats((prev) => [data.chat as IChat, ...prev]);
        } else {
          newChats[chatIndex] = data.chat as IChat;
          setChats(newChats);
        }
        fetchNumberOfNewChat();
      });
    }

    return () => {
      socket?.off("getMessage");
    };
  }, [socket, chats, fetchNumberOfNewChat]);

  return (
    <div className="flex flex-col h-full mb-4 relative">
      <div className="flex flex-col flex-1 gap-5 overflow-y-auto custom-scrollbar">
        <h1 className="text-2xl font-semibold">Messages</h1>
        <InfiniteLoad
          fetchData={fetchMoreChat}
          isLoading={isLoading}
          hasMore={hasMoreChat}
          hideEnd={true}
          className="flex flex-col gap-3"
        >
          {chats.map((chat) => {
            const isNew =
              chat.seenBy.includes(currentUser?.id || "") ||
              chat.id === selectedChat?.id;
            return (
              <div
                key={chat.id}
                className="chat-container flex items-center p-5 bg-white rounded-xl gap-5 cursor-pointer relative hover:bg-[#e1e1e1]"
                onClick={() => handleOpenChat(chat.id as string, chat.receiver)}
              >
                <img
                  className="w-[40px] h-[40px] rounded-full object-cover"
                  src={chat.receiver.avatar || defaultAvatar}
                  alt="avatar"
                />
                <div className="flex flex-col w-full overflow-hidden">
                  <span className="font-bold">{`${chat.receiver.firstName} ${chat.receiver.lastName}`}</span>
                  <p
                    className={`text-sm text-ellipsis whitespace-nowrap overflow-hidden ${
                      !isNew && "font-bold"
                    }`}
                  >
                    {chat.lastMessage}
                  </p>
                </div>
                {!isNew && (
                  <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-blue-500"></div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat);
                  }}
                  className="hidden absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full hover:bg-[#b5b5b5]"
                >
                  <HiOutlineTrash size={20} />
                </button>
              </div>
            );
          })}
        </InfiniteLoad>
      </div>
      {selectedChat && (
        <MessageBox
          dataChat={selectedChat}
          setDataChat={setSelectedChat}
          handleClose={() => setSelectedChat(undefined)}
          handleUpdateChatState={handleUpdateChatState}
        />
      )}
      <ModalConfirm
        handleCofirm={confirmDeleteChat}
        isHandling={isDeleting}
        modalBody="You cannot undo after delete this conversation"
        modalHeader="Delete conversation"
        openModal={openConfirmChat}
        setOpenModal={setOpenConfirmChat}
      />
    </div>
  );
}

export default Chat;

import { Dropdown, Spinner } from "flowbite-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { IMessage } from "../../types/message.types";
import { convertDateTimeToAgo } from "../../utils/utils";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "/images/default-avatar.png";
import {
  createMessage,
  getMessages,
  updateMessage,
} from "../../apis/message.api";
import { readChat } from "../../apis/chat.api";
import { SocketContext } from "../../context/SocketContext";
import { IConversation } from "../Chat/Chat";
import ModalConfirm from "../Modal/Confirm";

interface IProps {
  dataChat: IConversation;
  handleClose: () => void;
  handleUpdateChatState?: (
    chatId: string,
    lastMessage: string,
    chat?: IConversation
  ) => void;
  setDataChat?: React.Dispatch<React.SetStateAction<IConversation | undefined>>;
}

const MessageBox = ({
  dataChat,
  handleClose,
  handleUpdateChatState,
  setDataChat,
}: IProps) => {
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasMoreMessage, setHasMoreMessage] = useState(true);
  const [messagePage, setMessagePage] = useState(2);
  const [dataMessage, setDataMessage] = useState<IMessage[]>([]);
  const [totalMessage, setTotalMessage] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<IMessage>();
  const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdateMessage, setIsUpdateMessage] = useState(false);

  const fetchMoreMessage = async () => {
    try {
      const res = await getMessages(dataChat?.id || "", messagePage);
      setDataMessage((prev) => [...prev, ...(res.data || [])]);
      setTotalMessage(res.total || 0);
      if (
        dataMessage.length > 0 &&
        dataMessage.length + (res.data?.length || 0) >= (res.total || 0)
      )
        setHasMoreMessage(false);
      setMessagePage((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get("message") || "";
    if (!message.toString().trim()) return;
    try {
      if (!isUpdateMessage) {
        const res = await createMessage(
          dataChat?.id || "0",
          message.toString().trim(),
          dataChat?.receiver?.id
        );
        if (
          !dataMessage.find(
            (message) => message.id === (res.data?.id as string)
          )
        ) {
          setDataMessage((prev) => [res.data as IMessage, ...prev]);
        }
        setDataChat &&
          setDataChat((prev) =>
            prev
              ? {
                  ...(res.data?.chat as IConversation),
                  receiver: prev.receiver,
                  receiverId: prev.receiver?.id,
                }
              : res.data?.chat
          );
        socket?.emit("sendMessage", {
          receiverId: dataChat?.receiver.id,
          data: {
            ...res.data,
            chat: { ...res.data?.chat, receiver: currentUser },
          },
        });
        handleUpdateChatState &&
          handleUpdateChatState(
            dataChat.id as string,
            res.data?.text as string,
            res.data?.chat as IConversation
          );
      } else {
        const res = await updateMessage(selectedMessage?.id as string, {
          chatId: dataChat.id as string,
          text: message.toString().trim(),
          lastMessageId: dataMessage[0].id,
        });
        const newMessage = [...dataMessage];
        const updatedMessage = newMessage.find(
          (message) => message.id === selectedMessage?.id
        );
        if (updatedMessage) {
          updatedMessage.isUpdated = true;
          updatedMessage.text = res.data?.text || "";
        }
        setDataMessage(newMessage);
        setIsUpdateMessage(false);
        socket?.emit("updateMessage", {
          receiverId: dataChat?.receiver.id,
          data: res.data,
        });
        handleUpdateChatState &&
          selectedMessage?.id === dataMessage[0].id &&
          handleUpdateChatState(
            dataChat.id as string,
            res.data?.text as string
          );
      }
      if (textareaRef.current) textareaRef.current.value = "";
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (dataChat?.id) {
      setMessagePage(2);
      setHasMoreMessage(true);
      const getMessagesData = async () => {
        const res = await getMessages(dataChat?.id || "", 1);
        setDataMessage(res.data || []);
      };
      getMessagesData();
    }
  }, [dataChat?.id]);

  useEffect(() => {
    const readMessage = async () => {
      try {
        await readChat(dataChat?.id as string);
      } catch (error) {
        console.log(error);
      }
    };
    if (socket && !!dataChat) {
      socket.on("getMessage", (data: IMessage) => {
        if (dataChat.id === data.chatId) {
          if (!dataMessage.find((message) => message.id === data.id)) {
            setDataMessage((prev) => [data, ...prev]);
          }
          readMessage();
          handleUpdateChatState &&
            handleUpdateChatState(dataChat.id, data.text as string);
        }
      });
      socket.on("getStatusMessage", (data: IMessage) => {
        if (dataChat.id === data.chatId) {
          const newDataMessage = [...dataMessage];
          const updatedMessage = newDataMessage.find(
            (message) => message.id === data.id
          );
          if (updatedMessage) {
            updatedMessage.isDeleted = data.isDeleted;
            updatedMessage.isUpdated = data.isUpdated;
            updatedMessage.text = data.text;
          }
          setDataMessage(newDataMessage);
          readMessage();
          handleUpdateChatState &&
            handleUpdateChatState(dataChat.id, data.lastMessage as string);
        }
      });
    }

    return () => {
      socket?.off("getMessage");
      socket?.off("getStatusMessage");
    };
  }, [socket, dataChat, dataMessage, handleUpdateChatState]);

  const handleDeleteMessage = (message: IMessage) => {
    setSelectedMessage(message);
    setOpenModalConfirmDelete(true);
  };

  const confirmDeleteMessage = async () => {
    try {
      setIsDeleting(true);
      const res = await updateMessage(selectedMessage?.id as string, {
        chatId: dataChat.id as string,
        isDeleted: true,
        lastMessageId: dataMessage[0].id,
      });
      const newMessage = [...dataMessage];
      const deletedMessage = newMessage.find(
        (message) => message.id === selectedMessage?.id
      );
      if (deletedMessage) deletedMessage.isDeleted = true;
      setDataMessage(newMessage);
      socket?.emit("updateMessage", {
        receiverId: dataChat?.receiver.id,
        data: res.data,
      });
      console.log(res.data);
      handleUpdateChatState &&
        selectedMessage?.id === dataMessage[0].id &&
        handleUpdateChatState(
          dataChat.id as string,
          res.data?.lastMessage as string
        );
    } catch (error) {
      console.log(error);
    } finally {
      setOpenModalConfirmDelete(false);
      setIsDeleting(false);
    }
  };

  const handleEditMessage = (message: IMessage) => {
    setSelectedMessage(message);
    setIsUpdateMessage(true);
    if (textareaRef.current) textareaRef.current.value = message.text || "";
  };

  const handleCancelEditMessage = () => {
    setIsUpdateMessage(false);
    if (textareaRef.current) textareaRef.current.value = "";
  };

  useEffect(() => {
    textareaRef.current && textareaRef.current.focus();
  }, [textareaRef]);

  return (
    <div className="flex flex-col flex-1 justify-between bg-white h-[420px] fixed md:absolute bottom-0 left-1/2 -translate-x-1/2 w-[350px] z-[1001] border border-gray-200 rounded-t-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 font-bold bg-third">
        <div className="flex items-center gap-5">
          <img
            className="w-[30px] h-[30px] rounded-full object-cover"
            src={dataChat.receiver.avatar || defaultAvatar}
            alt="avatar"
          />
          {`${dataChat.receiver.firstName} ${dataChat.receiver.lastName}`}
        </div>
        <button className="outline-0 border-0" onClick={handleClose}>
          <i className="fa-solid fa-times text-lg" />
        </button>
      </div>
      <div
        id="scrollableDiv"
        className="flex flex-col-reverse h-[350px] p-5 gap-5 overflow-auto custom-scrollbar"
      >
        <InfiniteScroll
          next={fetchMoreMessage}
          inverse
          dataLength={totalMessage}
          loader={
            totalMessage > 0 && (
              <div className="flex-center">
                <Spinner size="sm" color="warning" />
              </div>
            )
          }
          hasMore={hasMoreMessage}
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            gap: 10,
          }}
          scrollableTarget="scrollableDiv"
        >
          {dataMessage?.map((message) => {
            const isOwner = currentUser?.id === message.userId;
            return (
              <div key={message.id} className="flex flex-col gap-[2px]">
                <div
                  className={`message-item w-full flex gap-2 items-center ${
                    isOwner ? "self-end justify-end" : ""
                  }`}
                >
                  {!message.isDeleted && isOwner && (
                    <Dropdown
                      label={
                        <i className="fa-solid fa-ellipsis-vertical text-black" />
                      }
                      arrowIcon={false}
                      theme={{
                        floating: {
                          target:
                            "hidden cursor-pointer border-0 relative rounded-full w-6 h-6 hover:!bg-[#eaeaea] bg-![#fff]",
                        },
                      }}
                      className="z-[1001]"
                    >
                      <Dropdown.Item
                        className="font-medium"
                        onClick={() => handleDeleteMessage(message)}
                      >
                        Delete
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="font-medium"
                        onClick={() => handleEditMessage(message)}
                      >
                        Edit
                      </Dropdown.Item>
                    </Dropdown>
                  )}
                  <p
                    title={convertDateTimeToAgo(message.createdAt)}
                    dangerouslySetInnerHTML={{
                      __html: message.isDeleted
                        ? "Message is deleted"
                        : message.text?.replace(/\n/g, "<br />"),
                    }}
                    className={`max-w-[55%] p-3 rounded-2xl w-fit text-sm ${
                      isOwner && !message.isDeleted
                        ? "self-end bg-third"
                        : "w-fit border border-gray-300"
                    } ${message.isDeleted && "italic bg-slate-100"}`}
                  ></p>
                </div>
                {message.isUpdated && !message.isDeleted && (
                  <p
                    className={`text-[12px] ${
                      isOwner ? "self-end mr-2" : "ml-2"
                    }`}
                  >
                    Is edited
                  </p>
                )}
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
      <form onSubmit={handleSubmit}>
        {isUpdateMessage && (
          <div className="flex justify-between items-center px-2 p-1">
            <p className="font-semibold">Edit message</p>
            <button
              onClick={handleCancelEditMessage}
              className="w-6 h-6 rounded-full hover:bg-[#eaeaea] flex-center"
            >
              <i className="fa-solid fa-times" />
            </button>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-gray-200 h-[66px]">
          <textarea
            name="message"
            className="flex-4 h-full border-0 p-5 resize-none overflow-auto custom-scrollbar"
            ref={textareaRef}
          ></textarea>
          <button className="flex-1 bg-third h-full border-0 flex-center">
            <svg
              className="text-black rotate-90 w-1/2 h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 2a1 1 0 0 1 .932.638l7 18a1 1 0 0 1-1.326 1.281L13 19.517V13a1 1 0 1 0-2 0v6.517l-5.606 2.402a1 1 0 0 1-1.326-1.281l7-18A1 1 0 0 1 12 2Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </form>
      <ModalConfirm
        handleCofirm={confirmDeleteMessage}
        isHandling={isDeleting}
        modalBody="You cannot undo after delete this message"
        modalHeader="Delete message"
        openModal={openModalConfirmDelete}
        setOpenModal={setOpenModalConfirmDelete}
      />
    </div>
  );
};

export default MessageBox;

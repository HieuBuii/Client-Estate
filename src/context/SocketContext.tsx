import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import { IMessage } from "../types/message.types";

interface IProps {
  children: ReactNode;
}

interface IContext {
  socket: Socket | null;
}

interface ServerToClientEvents {
  getMessage: () => IMessage;
}

interface ClientToServerEvents {
  newUser: (userId: string) => void;
  sendMessage: ({
    receiverId,
    data,
  }: {
    receiverId: string;
    data: IMessage;
  }) => void;
}

const initContext = {
  socket: null,
};

export const SocketContext = createContext<IContext>(initContext);

export const SocketContextProvider = ({ children }: IProps) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  useEffect(() => {
    setSocket(io(import.meta.env.VITE_SOCKET_URL));
  }, []);

  useEffect(() => {
    currentUser && socket?.emit("newUser", currentUser?.id as string);
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

import { ReactNode, createContext, useEffect, useState } from "react";
import { IUser } from "../types/user.types";

interface IProps {
  children: ReactNode;
}

interface IContext {
  currentUser: IUser | null;
  updateCurrentUser: (data: IUser | null) => void;
}

const initContext = {
  currentUser: null,
  updateCurrentUser: () => {},
};

export const AuthContext = createContext<IContext>(initContext);

export const AuthContextProvider = ({ children }: IProps) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string)
      : null
  );

  const updateCurrentUser = (data: IUser | null) => {
    setCurrentUser(data);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

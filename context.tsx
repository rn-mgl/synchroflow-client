"use client";
import React from "react";

import { io, Socket } from "socket.io-client";
import { disconnectSocket, getSocket } from "./src/components/utils/socket";

interface AppContextData {
  socket: Socket | null;
}

const AppContext = React.createContext<AppContextData | null>(null);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    const socketInstance = getSocket();

    setSocket(socketInstance);

    // return () => {
    //   disconnectSocket();
    // };
  }, []);

  return (
    <AppContext.Provider value={{ socket }}>{children}</AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return React.useContext(AppContext)!;
};

export { AppContext, AppProvider };

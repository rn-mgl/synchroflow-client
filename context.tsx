"use client";
import React from "react";

import { io, Socket } from "socket.io-client";

interface AppContextData {
  socket: Socket;
}

const AppContext = React.createContext<AppContextData | null>(null);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const url = process.env.API_URL as string;
  const socket = io(url);

  return (
    <AppContext.Provider value={{ socket }}>{children}</AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return React.useContext(AppContext)!;
};

export { AppContext, AppProvider };

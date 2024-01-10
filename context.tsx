"use client";
import React from "react";

import { io, Socket } from "socket.io-client";

interface AppContextData {
  url: string;
  socket: Socket;
}

const AppContext = React.createContext<AppContextData | null>(null);

const local = "http://192.168.1.121:9000";
const prod = "https://synchroflow-server.onrender.com";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const url = prod;
  const socket = io(url);

  return <AppContext.Provider value={{ url, socket }}>{children}</AppContext.Provider>;
};

export const useGlobalContext = () => {
  return React.useContext(AppContext)!;
};

export { AppContext, AppProvider };

"use client";
import React from "react";
import { io } from "socket.io-client";

interface AppContextData {
  url: string;
}

const AppContext = React.createContext<AppContextData | null>(null);

const local = "http://192.168.1.121:9000";
const prod = "";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const url = local;
  const socket = io(local);

  return <AppContext.Provider value={{ url }}>{children}</AppContext.Provider>;
};

export const useGlobalContext = () => {
  return React.useContext(AppContext)!;
};

export { AppContext, AppProvider };

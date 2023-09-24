import { io } from "socket.io-client";

const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export const socket = io("http://192.168.1.121:9000", { autoConnect: false });

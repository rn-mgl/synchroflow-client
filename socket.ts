import { io } from "socket.io-client";

const local = "http://192.168.1.121:9000";
const prod = "https://synchroflow-server.onrender.com";

export const socket = io(prod, { autoConnect: false });

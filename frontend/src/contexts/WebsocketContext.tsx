import { createContext } from "react";
import { io, Socket } from "socket.io-client";

export const DMsocket = io('http://localhost:8080')
export const WebDMsocketContext = createContext<Socket>(DMsocket);
export const WebDMsocketProvider = WebDMsocketContext.Provider;

export const ChannelSocket = io('http://localhost:8080')
export const WebChannelSocketContext = createContext<Socket>(ChannelSocket);
export const WebChannelSocketProvider = WebDMsocketContext.Provider;

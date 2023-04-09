import { createContext } from "react";
import { io, Socket } from "socket.io-client";

/**
 * アプリの全体を管理するsocket
 */
export const RootSocket = io('http://localhost:8080', {
  transports: ['websocket']
})
export const RootWebsocketContext = createContext<Socket>(RootSocket);
export const RootWebsocketProvider = RootWebsocketContext.Provider;

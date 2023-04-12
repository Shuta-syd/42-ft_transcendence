import { createContext } from "react";
import { Socket } from "socket.io-client";

export const RootWebsocketContext = createContext<Socket>({} as Socket);
export const RootWebsocketProvider = RootWebsocketContext.Provider;

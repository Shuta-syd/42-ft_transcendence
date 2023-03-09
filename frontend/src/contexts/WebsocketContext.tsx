import { createContext } from "react";
import { io, Socket } from "socket.io-client";

export const GameSocket = io('http://localhost:8080')
export const GameWebsocketContext = createContext<Socket>(GameSocket);
export const GameWebsocketProvider = GameWebsocketContext.Provider;

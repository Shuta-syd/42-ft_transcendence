import { createContext } from "react";
import { io, Socket } from "socket.io-client";

/**
 * このsocketは今後削除する
 */
export const GameSocket = io('http://localhost:8080')
export const GameWebsocketContext = createContext<Socket>(GameSocket);
export const GameWebsocketProvider = GameWebsocketContext.Provider;

/**
 * アプリの全体を管理するsocket
 */
export const RootSocket = io('http://localhost:8080')
export const RootWebsocketContext = createContext<Socket>(RootSocket);
export const RootWebsocketProvider = RootWebsocketContext.Provider;

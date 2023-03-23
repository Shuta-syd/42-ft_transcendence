import React from "react";
import { Socket } from "socket.io-client";
import { useOutletContext, useParams } from "react-router-dom";
import UserParticipantsComponent from "../utils/UserParticipantsComponent";
import ChatDisplayComponent from "./ChatDisplayComponent";

type ContextType = {
  socket: Socket;
  userName: string;
}

/**
 * @returns 実際にchatをするトーク画面のコンポーネント
 */
export default function ChatWindowComponent() {
  const { socket, userName } = useOutletContext<ContextType>();
  const { roomId } = useParams();
  const ChatRoomId = roomId as string;

  return (
    <>
      <ChatDisplayComponent socket={socket} roomId={ChatRoomId} userName={userName} />
      <UserParticipantsComponent roomId={ChatRoomId} isDM={true} />
    </>
  )
}

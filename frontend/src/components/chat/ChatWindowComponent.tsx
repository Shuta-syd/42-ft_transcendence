import React from "react";
import { Socket } from "socket.io-client";
import { useOutletContext, useParams } from "react-router-dom";
import ChannelDisplayComponent from "../channel/ChannelDisplayComponent";
import UserParticipantsComponent from "../channel/UserParticipantsComponent";

/**
 * @returns 実際にchatをするトーク画面のコンポーネント
 */
export default function ChatWindowComponent() {
  const socket: Socket = useOutletContext();
  const { roomId } = useParams();
  const ChatRoomId = roomId as string;

  return (
    <>
      <ChannelDisplayComponent socket={socket} roomId={ChatRoomId} />
      <UserParticipantsComponent roomId={ChatRoomId} />
    </>
  )
}

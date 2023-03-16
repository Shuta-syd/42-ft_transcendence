import React from "react";
import { Socket } from "socket.io-client";
import { useOutletContext, useParams } from "react-router-dom";
import ChannelDisplayComponent from "./ChannelDisplayComponent";
import UserParticipants from "./UserParticipantsComponent";

export default function ChannelWindowComponent() {
  const socket: Socket = useOutletContext();
  const { roomId } = useParams();
  const ChatRoomId = roomId as string;

  return (
    <>
      <ChannelDisplayComponent socket={socket} roomId={ChatRoomId} />
      <UserParticipants roomId={ChatRoomId} />
    </>
  )
}

import React from "react";
import { Socket } from "socket.io-client";
import { useOutletContext, useParams } from "react-router-dom";
import ChannelDisplayComponent from "./ChannelDisplayComponent";
import NewUserParticipants from "./UserParticipantsComponent";

export default function NewChannelWindowComponent() {
  const socket: Socket = useOutletContext();
  const { roomId } = useParams();
  const ChatRoomId = roomId as string;

  return (
    <>
      <ChannelDisplayComponent socket={socket} roomId={ChatRoomId} />
      <NewUserParticipants roomId={ChatRoomId} />
    </>
  )
}

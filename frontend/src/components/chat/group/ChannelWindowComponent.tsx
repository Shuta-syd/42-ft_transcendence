import React from "react";
import { Socket } from "socket.io-client";
import { useOutletContext, useParams } from "react-router-dom";
import ChannelDisplayComponent from "./ChannelDisplayComponent";
import UserParticipantsComponent from "../utils/UserParticipantsComponent";

type OutletContextType = {
  socket: Socket;
  setChannels: any;
  channels: any;
}

export default function ChannelWindowComponent() {
  const {socket, setChannels, channels} = useOutletContext<OutletContextType>();
  const { roomId } = useParams();
  const ChatRoomId = roomId as string;

  return (
    <>
      <ChannelDisplayComponent
        socket={socket}
        roomId={ChatRoomId}
        channels={channels}
        setChannels={setChannels}
      />
      <UserParticipantsComponent roomId={ChatRoomId} />
    </>
  )
}

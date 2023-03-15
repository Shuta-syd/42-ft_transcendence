import React from "react";
import { Socket } from "socket.io-client";

type ChannelListComponentProps = {
  socket: Socket;
  channels: any;
  setChannels: any; // useState setter
}

export default function NewChannelListComponent(props: ChannelListComponentProps) {

}

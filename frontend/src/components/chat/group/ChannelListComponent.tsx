import { Avatar, AvatarGroup, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Socket } from "socket.io-client";
import { ChatRoom } from "../../../types/PrismaType";
import '../../../styles/Chat.css'
import LeaveButton from "../utils/LeaveButton";

type ChannelListComponentProps = {
  socket: Socket;
  channels: any;
  setChannels: any; // useState setter
  isLeave: boolean;
}

/**
 * @returns Message送信可能なChannel一覧を表示するコンポーネント
 */
export default function ChannelListComponent(props: ChannelListComponentProps) {
  const { socket, channels, setChannels, isLeave } = props;
  const roomID = useLocation().pathname.split('/')[3];
  const [prevRoomId, setPrevRoomId] = useState<string>();

  useEffect(() => {
    if (roomID === undefined) return;
    if (prevRoomId === roomID) return;
    if (prevRoomId)
      socket.emit('leave_chat_room', { id: prevRoomId });
    socket.emit('join_chat_room', { id: roomID });
    setPrevRoomId(roomID);
  }, [roomID, socket, prevRoomId]);

  return (
    <>
    {channels.map((room: ChatRoom, idx: number) => (
      <Link
        key={idx}
        to={`/channel/room/${room.id}`}
        className={'ChannelLink'}
      >
        {room.id === roomID ? (
          <Grid
            container height={'7vh'}
            sx={{ display: 'flex', alignItems: 'center' }}
            className={'ChannelListActive'}
          >
            <Grid item mr={2} ml={3}>
              <AvatarGroup max={3}>
                {room.members?.map((member: any, id: number) => (
                  <Avatar key={id} src={`${member.user.image}`} />
                )) }
              </AvatarGroup>
            </Grid>
            <Grid item>
              <Typography variant='subtitle1'>
                {room.name}
              </Typography>
            </Grid>
            {isLeave ? (
              <Grid item>
                <LeaveButton roomId={room.id} setChannels={setChannels} channels={channels} isDM={false}/>
              </Grid>
            ) : (<></>)}
          </Grid>
        ) : (
          <Grid
          container height={'7vh'}
          sx={{ display: 'flex', alignItems: 'center' }}
          className={'ChannelList'}
        >
          <Grid item mr={2} ml={3}>
            <AvatarGroup max={3}>
            {room.members?.map((member: any, id: number) => (
                  <Avatar key={id} src={`${member.user.image}`} />
                )) }
            </AvatarGroup>
          </Grid>
          <Grid item>
            <Typography variant='subtitle1'>
              {room.name}
            </Typography>
          </Grid>
          {isLeave ? (
              <Grid item>
              <LeaveButton roomId={room.id} setChannels={setChannels} channels={channels} isDM={false}/>
              </Grid>
            ) : (<></>)}
        </Grid>
        )}
      </Link>
    ))}
    </>
  )
}

import { IconButton } from "@mui/material";
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type LeaveButtonProps = {
  roomId: string;
  setChannels: any; // useState setter
  channels: any; // useState value
}

export default function LeaveButton(props: LeaveButtonProps) {
  const { roomId, setChannels, channels } = props;
  const router = useNavigate();

  const handleOnClick = async () => {
    try {
      await axios.delete(`http://localhost:8080/chat/channel/member/leave`, { data: { roomId} })
      const newChannels = channels.filter((room: { id: string; }) => room.id !== roomId);
      setChannels(newChannels);
      router('/channel/room');
    } catch (error) {
      alert('チャンネルの離脱に失敗しました');
    }
  }

  return (
    <>
      <IconButton
        sx={{ color: '#fb5c59' }}
        onClick={handleOnClick}
      >
        <HighlightOffOutlinedIcon/>
      </IconButton>
    </>
  )
}

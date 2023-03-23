import React, { useEffect, useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { Socket } from "socket.io-client";
import CustomRadioGroup from "../../utils/CustomRadioGroup";
import FormController from "../../utils/FormController";

type CreateChannelDto = {
  name: string;
  type: string;
  password?: string;
}

type ChannelEditDialogProps = {
  roomId: string;
  setChannels: any
  channels: any;
  socket: Socket;
}

export default function ChannelEditDialog(props: ChannelEditDialogProps) {
  const { roomId, setChannels, channels, socket } = props;
  const [settingOpen, setSettingOpen] = useState<boolean>(false);
  const [type, setType] = useState<string>('PUBLIC');
  const { control, handleSubmit, reset, setValue } = useForm<CreateChannelDto>()


  useEffect(() => {
    const getChannel = async () => {
      const { data } = await axios.get(`http://localhost:8080/chat/room/${roomId}`);
      setValue('name', data.name);
      setValue('type', data.type);
      setValue('password', data.password);
    }

    getChannel();
  }, [channels, roomId]);

  const onSubmit: SubmitHandler<CreateChannelDto> = async (data) => {
    try {
      await axios.patch(`http://localhost:8080/chat/channel/${roomId}`, { type: data.type, name: data.name, password: data.type === 'PROTECT' ? data.password : '' })
      socket.emit('update_channel_info', { id: roomId, name: data.name });
      setSettingOpen(false);
      reset();
      const updatedChannels = channels.map((room: any) => {
        if (room.id === roomId) {
          return { ...room, name: data.name };
        }
        return room;
    });
    setChannels(updatedChannels);
    } catch (error) {
      alert('チャンネルの変更に失敗しました');
    }
  }

  const handleOnClick = () => {
    setSettingOpen(true);
  }

  return (
    <>
      <IconButton onClick={handleOnClick}>
        <SettingsIcon />
      </IconButton>
      <Dialog open={settingOpen} fullWidth>
        <DialogTitle>Edit Channel</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
              <FormController
                name="name"
                control={control}
                RenderComponent={(field: any) => (
                  <TextField
                    {...field}
                    autoFocus
                    fullWidth
                    label={'Channel Name'}
                    variant='standard'
                  />
                )}
              />
              <FormController
                name="type"
                control={control}
                RenderComponent={(field: any) => (
                  <CustomRadioGroup
                    field={field}
                    label="Channel Create"
                    setType={setType}
                    formControlLabels={["PUBLIC", "PROTECT", "PRIVATE"]}
                  />
                )}
              />
              <FormController
                name="password"
                control={control}
                RenderComponent={(field: any) => (
                  <TextField
                    {...field}
                    disabled={type !== 'PROTECT'}
                    fullWidth
                    label={'password'}
                    variant='standard'
                  />
                )}
              />
            </Stack>
          <DialogActions>
            <Button onClick={() => setSettingOpen(false)}>Undo</Button>
            <Button type="submit">Change</Button>
          </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

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
  oldPassword?: string;
  newPassword?: string;
}

type ChannelEditDialogProps = {
  roomId: string;
  channels: any;
  socket: Socket;
}

export default function ChannelEditDialog(props: ChannelEditDialogProps) {
  const { roomId, channels, socket } = props;
  const [settingOpen, setSettingOpen] = useState<boolean>(false);
  const [type, setType] = useState<string>('PUBLIC');
  const { control, handleSubmit, reset, setValue } = useForm<CreateChannelDto>()


  useEffect(() => {
    const getChannel = async () => {
      const { data } = await axios.get(`http://localhost:8080/chat/room/${roomId}`);
      setValue('name', data.name);
      setValue('type', data.type);
      setType(data.type);
    }

    getChannel();
  }, [channels, roomId]);

  const onSubmit: SubmitHandler<CreateChannelDto> = async (data) => {
    try {
      await axios.patch(`http://localhost:8080/chat/channel/${roomId}`, {
        type: data.type,
        name: data.name,
        oldPassword: data.type === 'PROTECT' ? data.oldPassword : '',
        newPassword: data.type === 'PROTECT' ? data.newPassword : '',
      })
      socket.emit('update_channel_info', { id: roomId, name: data.name });
      setSettingOpen(false);
      reset();
    } catch (error) {
      alert('パスワードが違うもしくは他理由でチャンネルの変更に失敗しました');
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
                  maxLength={100}
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
                name="oldPassword"
                control={control}
                RenderComponent={(field: any) => (
                  <TextField
                    {...field}
                    maxLength={100}
                    disabled={type !== 'PROTECT'}
                    fullWidth
                    label={'oldPassword'}
                    variant='standard'
                  />
                )}
              />
              <FormController
                name="newPassword"
                control={control}
                RenderComponent={(field: any) => (
                  <TextField
                    {...field}
                    maxLength={100}
                    disabled={type !== 'PROTECT'}
                    fullWidth
                    label={'newPassword'}
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

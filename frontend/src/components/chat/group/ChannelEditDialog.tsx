import React, { useEffect, useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import CustomRadioGroup from "../../utils/CustomRadioGroup";
import FormController from "../../utils/FormController";

type CreateChannelDto = {
  name: string;
  type: string;
  password?: string;
}

export default function ChannelEditDialog(props: { roomId: string }) {
  const { roomId } = props;
  const [settingOpen, setSettingOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<string>('PUBLIC');
  const [password, setPassword] = useState<string>('');
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name,
      type,
      password,
    }
  })

  useEffect(() => {
    const getChannel = async () => {
      const { data } = await axios.get(`http://localhost:8080/chat/room/${roomId}`);
      setName(data.name);
      setType(data.type);
      setPassword(data.password)
    }

    getChannel();
  }, [roomId]);

  const onSubmit: SubmitHandler<CreateChannelDto> = async (data) => {
    await axios.patch(`http://localhost:8080/chat/channel/${roomId}`, { type: data.type, name: data.name, password: data.password })
    reset();
    setSettingOpen(false);
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
            <Button type="submit">Create</Button>
          </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

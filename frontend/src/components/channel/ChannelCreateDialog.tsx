import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomRadioGroup from "../utils/CustomRadioGroup";
import FormController from "../utils/FormController";

type ChannelCreateDialogProps = {
  isOpen: boolean;
  handleClose: any;
}

type CreateChannelDto = {
  name: string;
  type: string;
  password?: string;
}

/**
 * @return Channel作成画面のコンポーネント
 */
export default function ChannelCreateDialog(props: ChannelCreateDialogProps) {
  const { isOpen, handleClose } = props;
  const { control, handleSubmit } = useForm<CreateChannelDto>({
    defaultValues: {
      name: '',
      type: 'PUBLIC',
    }
  })

  const onSubmit: SubmitHandler<CreateChannelDto> = async (data) => {
    console.log(data);
  }

  return (
    <>
      <Dialog open={isOpen} fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogContent>
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
                  <CustomRadioGroup {...field} label="Channel Create" formControlLabels={["PUBLIC", "PROTECTED", "PRIVATE"]} />
                )}
              />
              <FormController
                name="password"
                control={control}
                RenderComponent={(field: any) => (
                  <TextField
                    {...field}
                    disabled
                    fullWidth
                    label={'password'}
                    variant='standard'
                  />
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Undo</Button>
            <Button type="submit">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

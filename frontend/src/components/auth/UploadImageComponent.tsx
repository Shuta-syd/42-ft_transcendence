/* eslint-disable no-unused-vars */
import { Box, Button } from "@mui/material";
import React, { useState } from "react";

type UploadImageComponentProps = {
  control: any; // useFrom control
  setActiveStep: any; // useState setter
}

export default function UploadImageComponent(props: UploadImageComponentProps) {
  const { control, setActiveStep } = props;
  const [image, setImage] = useState('');

  const onFileChange = (e: any) => {
    if (e.target.files === null) return;
    const file = e.target.files[0];
    if (!file) return;
    const imageURL = URL.createObjectURL(file);
    setImage(imageURL);
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box width={'15rem'} height={'15rem'} border={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          {image !== '' ? (
            <img src={image} alt="preview" style={{ maxWidth: '100%', maxHeight: '100%' }}/>
          ) : (
            <div>No Image</div>
          )}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box width={'15rem'}>
          <Button variant="contained" component="label">
            Upload
            <input hidden accept="image/*" type="file" onChange={(e) => { onFileChange(e); }}/>
          </Button>
        </Box>
      </Box>
    </>
  )
}

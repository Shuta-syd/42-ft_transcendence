import React from 'react';
import { Button, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

interface Props {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploadButton = ({ onUpload }: Props) => (
  <div
    style={{
      width: 380,
      height: 180,
      marginRight: 40,
      marginTop: 0,
    }}
  >
    <Button
      variant="contained"
      component="label"
      color="primary"
      sx={{
        width: 150, // Update width here
        height: 30,
      }}
    >
      image upload
      <input
        hidden
        accept="image/*"
        multiple
        type="file"
        onChange={(event) => onUpload(event)}
      />
    </Button>
    <IconButton color="primary" aria-label="upload picture" component="label">
      <input
        hidden
        accept="image/*"
        type="file"
        onChange={(event) => onUpload(event)}
      />
      <PhotoCamera />
    </IconButton>
  </div>
);

export default ImageUploadButton;

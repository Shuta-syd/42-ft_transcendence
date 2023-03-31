import { Box, Button } from "@mui/material";
import React from "react";

type UploadImageComponentProps = {
  image: any;
  setActiveStep: any; // useState setter
  onFileChange: any; // onChange
}

export default function UploadImageComponent(props: UploadImageComponentProps) {
  const { image, setActiveStep, onFileChange  } = props;


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
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" onClick={() => setActiveStep(0)}>BACK</Button>
        <Box width={'15rem'}>
          <Button variant="contained" component="label">
            Upload
            <input hidden accept="image/*" type="file" onChange={(e) => { onFileChange(e); }}/>
          </Button>
        </Box>
        <Button variant="contained" onClick={() => setActiveStep(2) }>NEXT</Button>
      </Box>
    </>
  )
}

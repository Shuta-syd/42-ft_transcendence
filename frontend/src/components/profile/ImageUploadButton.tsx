import React from 'react';
import { Button, IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

interface Props {
    onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploadButton = ({ onUpload }: Props) => {
    console.log('Upload button');
    return (
        <div>
            <Button
                variant="contained"
                component="label"
                color="success"
            >
                Upload
                <input hidden accept="image/*" multiple type="file" onChange={event => onUpload(event)}/>
            </Button>
            <IconButton color="primary" aria-label="upload picture" component="label">
                <input hidden accept="image/*" type="file" onChange={event => onUpload(event)} />
                <PhotoCamera/>
            </IconButton>
        </div>
    )
}

export default ImageUploadButton;

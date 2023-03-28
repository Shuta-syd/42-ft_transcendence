import React from 'react';
import { Button, IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

interface Props {
    onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploadButton = ({ onUpload }: Props) => {
    console.log('Upload button');
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'right',
                justifyContent: 'right'
            }}
        >
            <Button
                sx={{
                    width: 250, // Update width here
                    height: 50,
                    marginRight: 2,
                }}
                variant="contained"
                component="label"
                color="success"
            >
                Upload Profile Image
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

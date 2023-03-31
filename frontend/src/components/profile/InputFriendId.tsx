import React, { ChangeEvent } from 'react';
import { Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

interface InputFriendIdProps {
    handleDecideIdButton: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    handleInputID: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}



const InputFriendId = ({ handleDecideIdButton, handleInputID }: InputFriendIdProps) => {
    console.log('InputFriendId');
    return (
        <div>
            <h2>Find new friends!</h2>
            <TextField
                id="input-with-icon-textfield"
                label="Please enter [friend ID]"
                size="medium"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountCircle />
                        </InputAdornment>
                    ),
                    onChange: handleInputID,
                }}
                variant="standard"
            />
            <Button
                variant="contained"
                onClick={handleDecideIdButton}
            >
                ID決定
            </Button>
        </div>
    );
};

export default InputFriendId;

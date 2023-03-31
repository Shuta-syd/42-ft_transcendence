import React, { ChangeEvent, useState } from 'react';
import { Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

interface InputFriendIdProps {
    handleDecideIdButton: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    handleInputID: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InputFriendId = ({ handleDecideIdButton, handleInputID }: InputFriendIdProps) => {
    const [inputValue, setInputValue] = useState('');

    const handleResetInput = () => {
        setInputValue('');
    };

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
                    onChange: (e: ChangeEvent<HTMLInputElement>) => {
                        setInputValue(e.target.value);
                        handleInputID(e);
                    },
                }}
                variant="standard"
                value={inputValue}
            />
            <Button variant="contained" onClick={() => {
                // @ts-ignore
                handleDecideIdButton();
                handleResetInput();
            }}>
                ID決定
            </Button>
        </div>
    );
};

export default InputFriendId;

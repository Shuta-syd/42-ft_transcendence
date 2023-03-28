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
            <h1
                style={{
                    display: 'flex',
                    alignItems: 'right',
                    justifyContent: 'right',
                    width: '100%',
                    height: '100%',
                }}
            >
                <TextField
                    id="input-with-icon-textfield"
                    label="Please enter [friend ID]"
                    size="medium"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment
                                position="start"
                            >
                                <AccountCircle />
                            </InputAdornment>
                        ),
                        onChange: handleInputID,
                    }}
                    variant="standard"
                    style={{ width: 300, height: 50, marginTop: 10 }}
                    InputLabelProps={{
                        style: { fontSize: 25 },
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleDecideIdButton}
                    style={{ width: 100, height: 50, marginTop: 10 }}
                >
                    ID決定
                </Button>
            </h1>
        </div>
    );
};



export default InputFriendId;

import React, {useState} from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {User} from "../../types/PrismaType";


interface InputFriendIdProps {
    user: User | undefined;
}

const InputFriendId = (user: InputFriendIdProps) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    const handleInputChange = (event: any) => {
        setInputValue(event.target.value);
        setIsButtonDisabled(event.target.value === '');
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();

        setInputValue('');
        setIsButtonDisabled(true);
    }

    console.log(`InputFriendId: ${user}`)
    return (
        <div>
            <h1>InputFriendId</h1>
            <form onSubmit={handleSubmit}>
            <TextField
                size={"small"}
                label="Friend ID"
                variant="outlined"
                type={"text"}
                value={inputValue}
                onChange={handleInputChange}
                />
            <Button
                variant={"contained"}
                type={"submit"}
                disabled={isButtonDisabled}
            >
                Submit
            </Button>
            </form>
        </div>
    );
};

export default InputFriendId;

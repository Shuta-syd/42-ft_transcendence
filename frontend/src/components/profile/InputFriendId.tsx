import React, {useState} from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {User} from "../../types/PrismaType";
import {sendFriendRequest} from "../../hooks/profile/sendFriendRequests";



interface InputFriendIdProps {
    props: User | undefined;
}

const InputFriendId = (props: InputFriendIdProps) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    const handleInputChange = (event: any) => {
        setInputValue(event.target.value);
        setIsButtonDisabled(event.target.value === '');
    }

    const handleSubmit = async (event: any) => {
        // console.log(`Submitting: ${inputValue}`);
        console.log('hello', inputValue);
        const res = await sendFriendRequest(props?.props?.id, inputValue);
        console.log(res);
        event.preventDefault();
        setInputValue('');
        setIsButtonDisabled(true);
    }

    return (
        <div>
            <h2>Find new friends!</h2>
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

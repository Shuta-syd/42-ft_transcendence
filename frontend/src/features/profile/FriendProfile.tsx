import React, {useState, useEffect} from 'react';
import {Box} from "@mui/system";
import {Grid} from "@mui/material"
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import {User} from "../../types/PrismaType";

interface FriendProfileProps {
    friend: User | undefined;
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


const FriendProfile = (props: FriendProfileProps) => {
    // prerequisite: friend definition
    // if you pass the info of props, you should change initial value of useState
    const [friendName, setFriendName] = useState<string>('React');
    useEffect(() => {
        console.log(friendName);
        setFriendName('jack');
    }, []);

    return (
        <Box
            sx={{
                flexGrow: 1,
                bgcolor: 'background.paper',
            }}
        >
        <Grid container spacing={2}>
            <Grid item xs={6} md={8}>
                <Item>xs=6 md=8</Item>
            </Grid>
            <Grid item xs={6} md={4}>
                <Item>xs=6 md=4</Item>
            </Grid>
            <Grid item xs={6} md={4}>
                <Item>xs=6 md=4</Item>
            </Grid>
            <Grid item xs={6} md={8}>
                <Item>xs=6 md=8</Item>
            </Grid>
        </Grid>
        </Box>
    );
}

export default FriendProfile;

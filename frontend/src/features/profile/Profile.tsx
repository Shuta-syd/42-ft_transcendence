import React, {ChangeEvent, useEffect, useState} from 'react';
import {Avatar, Button} from "@mui/material";
import Rating from '@mui/material/Rating';
import {deepPurple} from "@mui/material/colors";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {Match, User} from "../../types/PrismaType";
import { useProfileUser } from "../../hooks/profile/useProfileUser";
import { sendFriendRequest } from "../../hooks/profile/sendFriendRequests";
import useQueryMatches from "../../hooks/match/useWueryMatch";

const Profile = () => {
    const [user, setUser] = useState<User>();

    const UserPromises = useProfileUser();
    useEffect(() => {
        UserPromises.then((userDto: User) => {
            setUser(userDto);
        });
    }, [UserPromises]);

    const [inputId, setInputId] = useState<string>("");
    const HandleInputID = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputId(e.target.value);
    }

    const handleButtonClick = async () => {
        sendFriendRequest(user?.id, inputId);
        console.log('inputid => ', inputId);
        console.log('  my id => ', user?.id);
    }

    const [matchArr, setMatches] = useState<Match[]>([]);
    const [winnerId, setWinnerId] = useState<string>('');
    const MatchPromises = useQueryMatches();
    useEffect(() => {
        MatchPromises.then((matches: Match[]) => {
            setMatches(matches);
            setWinnerId(matches[matches.length - 1].winner_id);
        });
    }, [MatchPromises]);

    function ShowResult(props: {p1: string, p2: string}) {
        // console.log('winnerId', winnerId);
        if (winnerId === '1') {
            return (
                <h2>
                    <div>
                        Winner
                        &nbsp;=&gt;
                        { props.p1  }!!!
                    </div>
                </h2>
            );
        }
        return (
            <h2>
                <div>
                    Winner
                    &nbsp;=&gt;
                    {  props.p2  }!!!
                </div>
            </h2>
        );
    }

    interface MatchListProps {
        matches: Match[];
    }
    function MatchList({ matches }: MatchListProps) {
        const [matchUser, setMatchUser] = useState<User>();
        const [selectedPlayer, setSelectedPlayer] = useState('');
        const [filteredMatches, setFilterdMatchs] = useState<Match[]>([]);
        const MatchUserPromises = useProfileUser();
        useEffect(() => {
            MatchUserPromises.then((userDto: User) => {
                setMatchUser(userDto);
                if (matchUser) {
                    setSelectedPlayer(matchUser.name);
                    const createdMatchs = selectedPlayer ? matches.filter((match) =>
                        match.player1 === selectedPlayer || match.player2 === selectedPlayer
                    ) : matches;
                    setFilterdMatchs(createdMatchs);
                }
            });
        }, [UserPromises]);




        return (
            <div>
                <h3>Result</h3>
                {filteredMatches.map((match) => (
                    <div key={match.id}>
                        <h1>[{match.id}] {match.player1} vs {match.player2}</h1>
                        <div>
                            <ShowResult p1={match.player1} p2={match.player2} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <Avatar
                sx={{ bgcolor: deepPurple[500]
                    , width: 100
                    , height: 100}}
            >
                <h1>
                {user?.name}
                </h1>
            </Avatar>
            <Rating
                name={user?.name}
                defaultValue={4}
                precision={0.5}
            />
            <p></p>
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
                    onChange: HandleInputID
                }}
                variant="standard"
            />
            <Button onClick={handleButtonClick}>
                enter
            </Button>
            <MatchList matches={matchArr} />
        </div>
    );
}


export default Profile;
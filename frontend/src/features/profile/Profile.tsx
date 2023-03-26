import React, {ChangeEvent, useEffect, useState} from 'react';
import {Avatar, Button, IconButton} from "@mui/material";
import axios from "axios";
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import io from "socket.io-client";
import * as SocketIOClient from 'socket.io-client';
import {PhotoCamera} from "@mui/icons-material";
import {Match, User} from "../../types/PrismaType";
import { fetchProfileUser } from "../../hooks/profile/useProfileUser";
import { sendFriendRequest } from "../../hooks/profile/sendFriendRequests";
import useQueryMatches from "../../hooks/match/useWueryMatch";


const Profile = () => {

    const [user, setUser] = useState<User>();
    const [socket, setSocket] = useState<SocketIOClient.Socket>(); // Socketを状態として持つ
    const UserPromises = fetchProfileUser();
    useEffect(() => {
        UserPromises.then((userDto: User) => {
            const params = { query: { name: userDto.name } };
            const Tmpsocket = io("http://localhost:8080", params);
            setSocket(Tmpsocket);
            setUser(userDto);
        });
    }, []);

    const [inputId, setInputId] = useState<string>("");
    const HandleInputID = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputId(e.target.value);
    }

    const handleDecideIdButton = async () => {
        sendFriendRequest(user?.id, inputId);
    }

    const getFriends = async () => {
        const { data } = await axios.get<User[]>(`http://localhost:8080/user/friend`);
        return data;
    }

    const [friends, setFriends] = useState<User[]>([]);

    const HandleFriendListButton = () => {
        const friendsPromise = getFriends();
        friendsPromise.then((data) => {
            console.log('data => ', data[0]);
            setFriends(data);
            data.map((friend: User) => {
                const tmp:FriendProps = {
                    friendName: friend.name
                };
                FriendStatus(tmp);
            });
        });
    };

    const [matchArr, setMatches] = useState<Match[]>([]);
    const [winnerId, setWinnerId] = useState<string>('');
    const MatchPromises = useQueryMatches();
    useEffect(() => {
        MatchPromises.then((matches: Match[]) => {
            setMatches(matches);
            setWinnerId(matches[matches.length - 1].winner_id);
        });
    }, []);

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
        const [selectedPlayer, setSelectedPlayer] = useState(user?.name);
        const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);

        useEffect(() => {
            // ユーザー情報を取得する非同期処理
            const getUserInfo = async () => {
                const userDto = await fetchProfileUser();
                if (userDto) {
                    setSelectedPlayer(userDto.name);
                }
            };
            getUserInfo();
        }, []);

        useEffect(() => {
            // 選択されたプレーヤー名が空の場合は全ての試合を表示する
            // player1もしくはplayer2に選択されたプレーヤー名を含む試合をフィルタリングする
            const filtered = matches.filter((match) => match.player1 === selectedPlayer || match.player2 === selectedPlayer);
            setFilteredMatches(filtered);
        }, []);

        return (
            <div>
                {/* フィルタリングされた試合のみ表示 */}
                {filteredMatches.map((match) => (
                    <div key={match.id}>
                        <h1>
                            [{match.id}] {match.player1} vs {match.player2}
                        </h1>
                        <div>
                            <ShowResult p1={match.player1} p2={match.player2}/>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    interface FriendProps {
        friendName: string;
    }


    const steveJobsImage = "https://cdn.profoto.com/cdn/053149e/contentassets/d39349344d004f9b8963df1551f24bf4/profoto-albert-watson-steve-jobs-pinned-image-original.jpg?width=1280&quality=75&format=jpg";

    function FriendStatus({friendName}: FriendProps) {
        const [isOnline, setIsOnline] = useState(null);

        useEffect(() => {
            // WebSocketを使用して、友達のオンライン/オフライン状態を取得する
            if (socket) {
            socket.emit("getFriendStatus", friendName);
                // サーバーからの応答を受信する
                socket.on("friendStatus", (status) => {
                    setIsOnline(status);
                });
            }
        }, []);

        if (isOnline === null) {
            return <span>Loading...</span>;
        }
        return (
            <span>{isOnline ? " -> Online" : " -> Offline"}</span>
        );
    }

    const [image, setImage] = useState(steveJobsImage);
    // const elonMuskImage = "https://upload.wikimedia.org/wikipedia/commons/e/e1/Elon_Musk_%28cropped%29.jpg";
    const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        setImage(URL.createObjectURL(event.target.files[0]));
    }

    return (
        <div>
            <Avatar
                variant="circular"
                color="success"
                alt={user?.name}
                src={image}
                sx={{width: 200, height: 200, margin: 2}}
            >
            </Avatar>
            <h1>
                {user?.name}
            </h1>
            <Button
                variant="contained"
                component="label"
                color="success"
            >
                Upload
                <input hidden accept="image/*" multiple type="file" onChange={event => uploadImage(event)}/>
            </Button>
            <IconButton color="primary" aria-label="upload picture" component="label">
                <input hidden accept="image/*" type="file"/>
                <PhotoCamera/>
            </IconButton>
            <p></p>
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
                            <AccountCircle/>
                        </InputAdornment>
                    ),
                    onChange: HandleInputID
                }}
                variant="standard"
            />
            <Button
                variant="contained"
                onClick={handleDecideIdButton}>
                ID決定
            </Button>
            <p></p>
            <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={HandleFriendListButton}
            >
                友達リスト
            </Button>
            <h1>
                {friends.map((friend: User) => (
                    <div key={friend.id}>
                        {friend.name}
                        <FriendStatus friendName={friend.name}/>
                    </div> // keyプロパティを追加
                ))}
            </h1>
            <h2>今までの戦績</h2>
            <MatchList matches={matchArr}/>
        </div>
    );
}


export default Profile;

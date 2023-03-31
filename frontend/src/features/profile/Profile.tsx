import React, {ChangeEvent, useEffect, useState} from 'react';
import { Button } from "@mui/material";
import axios from "axios";
import Rating from '@mui/material/Rating';
import io from "socket.io-client";
import {Match, User} from "../../types/PrismaType";
import {fetchProfileUser} from "../../hooks/profile/useProfileUser";
import {sendFriendRequest} from "../../hooks/profile/sendFriendRequests";
import useQueryMatches from "../../hooks/match/useWueryMatch";
import ShowAvatar from "../../components/profile/ShowAvatar";
import ImageUploadButton from "../../components/profile/ImageUploadButton";
import InputFriendId from "../../components/profile/InputFriendId";
import FingerPrintButton from "../../components/profile/FingerPrintButton";

const Profile = () => {
    const [user, setUser] = useState<User>();
    const socket = io("http://localhost:8080");
    const UserPromises = fetchProfileUser();
    useEffect(() => {
        UserPromises.then((userDto: User) => {
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
        const {data} = await axios.get<User[]>(`http://localhost:8080/user/friend`);
        return data;
    }

    const [friends, setFriends] = useState<User[]>([]);

    const HandleFriendListButton = () => {
        const friendsPromise = getFriends();
        friendsPromise.then((data) => {
            console.log('data => ', data[0]);
            setFriends(data);
        });
        console.log(friends[0]);
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

    function ShowResult(props: { p1: string, p2: string }) {
        // console.log('winnerId', winnerId);
        if (winnerId === '1') {
            return (
                <h2>
                    <div>
                        Winner
                        &nbsp;=&gt;
                        {props.p1}!!!
                    </div>
                </h2>
            );
        }
        return (
            <h2>
                <div>
                    Winner
                    &nbsp;=&gt;
                    {props.p2}!!!
                </div>
            </h2>
        );
    }

    interface MatchListProps {
        matches: Match[];
    }
<<<<<<< HEAD

    function ShowAchievement({matches}: MatchListProps) {
        const countMyWinTime =  () => {
            let count: number = 0;
            for (const match of matches) {
                const winnerName = match.winner_id === '1' ? match.player1 : match.player2;
                if (winnerName === user?.name) {
                    count += 1;
                }
            }
            return count;
        }
        enum Achievement {
            "Beginner" = 0,
            "Intermediate" = 5,
            "Advanced" = 10,
            "Expert" = 15,
        }

        const getAchievement = () => {
            if (countMyWinTime() < Achievement.Intermediate) {
                return "Beginner";
            }
            if (countMyWinTime() < Achievement.Advanced) {
                return "Intermediate";
            }
            if (countMyWinTime() < Achievement.Expert) {
                return "Advanced";
            }
            return "Expert";
        };

        return (
            <div>
                <h2>
                    Your current achievement : {getAchievement()}
                <p></p>
                <Rating
                    name={user?.name}
                    defaultValue={countMyWinTime()}
                    precision={0.5}
                    max={20}
                    readOnly
                />
                <p></p>
                </h2>
            </div>
        );
    }

    function MatchList({matches}: MatchListProps) {
=======
    
    function MatchList({ matches }: MatchListProps) {
>>>>>>> origin/main
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
                <h3>[⇩ Previous Record]</h3>
                {filteredMatches.map((match) => (
                    <div key={match.id}>
                        <h3>
                            [{match.id}] {match.player1} vs {match.player2}
                        </h3>
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

    function FriendStatus({friendName}: FriendProps) {
        const [isOnline, setIsOnline] = useState(null);

        useEffect(() => {
            // WebSocketを使用して、友達のオンライン/オフライン状態を取得する
            socket.emit("getFriendStatus", friendName);

            // サーバーからの応答を受信する
            socket.on("friendStatus", (status) => {
                setIsOnline(status);
            });

            // コンポーネントのアンマウント時にWebSocket接続を解除する
            return () => {
                socket.off("friendStatus");
            };
        }, [friendName]);

        if (isOnline === null) {
            return <span>Loading...</span>;
        }
        return (
            <span>{isOnline ? " => 🤩" : " => 🫥"}</span>
        );
    }

    // const steveJobsImage = "https://cdn.profoto.com/cdn/053149e/contentassets/d39349344d004f9b8963df1551f24bf4/profoto-albert-watson-steve-jobs-pinned-image-original.jpg?width=1280&quality=75&format=jpg";

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (files?.[0]) {
            const blobFiles = URL.createObjectURL(files[0]);
            const file = files[0];
            let base64: string;
            console.log("THIS ONE: ", blobFiles);
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = async () => {
                base64 = reader.result as string;
                console.log("base64: ", base64);

                try {
                    const response = await axios.post(
                        "http://localhost:8080/user/add/image",
                        { image: base64 },
                        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                    );
                    console.log("THIS ONE: ", response);
                    setProfileImage(base64);
                } catch (error) {
                    console.error(error);
                    console.log("This file is too large!!!!");
                }
            };
        }
    };

    // const elonMuskImage = "https://upload.wikimedia.org/wikipedia/commons/e/e1/Elon_Musk_%28cropped%29.jpg";
    // const steveJobsImage = "https://cdn.profoto.com/cdn/053149e/contentassets/d39349344d004f9b8963df1551f24bf4/profoto-albert-watson-steve-jobs-pinned-image-original.jpg?width=1280&quality=75&format=jpg";
    const [profileImage, setProfileImage] = useState('');
    useEffect(() => {
        const profileUser = fetchProfileUser();
        profileUser.then((us) => {
            setProfileImage(us?.image);
        });
    }, []);

    const handleFingerPrintButton = () => {
        console.log("FingerPrintButton clicked", user?.id);
        navigator.clipboard.writeText(user?.id as string);
    }

    const FriendListButton = () => {
        console.log('List button');
        return (
            <div>
                <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={HandleFriendListButton}
            >
                friend list
            </Button><h3>
                {friends.map((friend: User) => (
                    <div key={friend.id}>
                        [{friend.name}]
                        <FriendStatus friendName={friend.name}/>
                    </div>
                ))}
            </h3>
            </div>
        );
    }

    return (
        <div>
            <ShowAvatar user={user} profileImage={profileImage}/>
            <ImageUploadButton onUpload={uploadImage}/>
            <InputFriendId
                handleDecideIdButton={handleDecideIdButton}
                handleInputID={HandleInputID}
            />
            <FingerPrintButton onClick={handleFingerPrintButton}/>
            <FriendListButton/>
            <MatchList matches={matchArr}/>
            <ShowAchievement matches={matchArr}/>
        </div>
    );
}


export default Profile;

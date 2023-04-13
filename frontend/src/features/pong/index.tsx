import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import useSocket from "../../hooks/useSocket";
import { fetchProfileUser } from "../../hooks/profile/useProfileUser";
import { User } from "../../types/PrismaType";


const Pong = () => {
    const socket: Socket = useSocket("http://localhost:8080/pong");
    const [user, setUser] = useState<User>();
    const [groupId, setGroupId] = useState<string>("");
    const [countdown, setCountdown] = useState<number>(10);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProfileUser().then((userDto: User) => {
            setUser(userDto);
        });
    }, []);

    useEffect(() => {
        socket.emit("match_request");

        socket.on("match_found", (groupIdDto: string) => {
            console.log("match found! GroupId = ", groupIdDto);
            setGroupId(groupIdDto);
            setCountdown(10);
        });

        return () => {
            socket.off("match_found");
        };
    }, [socket]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCountdown((countsec) => countsec - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (countdown === 0 && groupId !== "") {
            socket.emit("join_group", groupId);
            navigate(`/game/${groupId}`);
        }
    }, [countdown, groupId, navigate, socket]);

    return (
      <div>
          <h1>{user?.name}</h1>
          {groupId ? (
            <div>
                <p>
                    Match found! Group ID: {groupId}, Starting in {countdown} seconds...
                </p>
            </div>
          ) : (
            <p>Waiting for a match...</p>
          )}
      </div>
    );
};

export default Pong;

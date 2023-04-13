/* eslint-disable import/prefer-default-export */

import axios from "axios";
import { ChatRoom } from "../../types/PrismaType";

/**
 * @description Get the friend name from the room name
 */
export  const getFriendNameFromRoomName = (room: string, username: string): string => {
  let friendName: string = '';

  const names = room.split(',');
  names.map((name) => {
    if (name !== username) {
      friendName = name;
    }
  })
  return friendName !== '' ?  friendName : 'undefined';
}

/**
  * @description Get the user id
 */
export const getUserId = async (): Promise<string> => {
  const { data } = await axios.get(`http://localhost:8080/user`);
  return data.id;
}

/**
 * @description Get the channel room
 */
export const getChannels = async (): Promise<ChatRoom[]> => {
  const { data } = await axios.get(`http://localhost:8080/chat/channel`);
  return data;
}

/**
 * @description Get the user role in the room
 */
export const getMyRole = async (roomId: string): Promise<string> => {
  const { data } = await axios.get(`http://localhost:8080/chat/${roomId}/myMember`);
  return data.role;
}

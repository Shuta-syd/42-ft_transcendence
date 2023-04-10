/* eslint-disable import/prefer-default-export */

import axios from "axios";

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
  return friendName;
}

/**
  * @description Get the user id from the backend
 */
export const getUserId = async (): Promise<string> => {
  const { data } = await axios.get(`http://localhost:8080/user`);
  return data.id;
}

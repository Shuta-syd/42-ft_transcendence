import axios from "axios";
import React, { useEffect, useState } from "react"
import { ChatRoom } from "../../types/PrismaType";

/**
 * @returns Message送信可能なChannel一覧を表示するコンポーネント
 */
export default function ChannelListComponent() {
  const [channels, setChannels] = useState<ChatRoom[]>([]);

  const getChannels = async ():Promise<ChatRoom[]> => {
    try {
      const res = await axios.get(`http://localhost:8080/channel`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
    return [];
  }

    useEffect(() => {
      const loadChannels = async () => {
        const channelData = await getChannels();
        setChannels(channelData);
      }

      loadChannels();
    }, [channels])

  return (
    <>
      <h1>this is ChannelListComponent</h1>
    </>
  )
}

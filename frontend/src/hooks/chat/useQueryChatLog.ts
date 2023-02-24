import axios from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Message } from "../../types/PrismaType";

function useQueryChatLog(roomId: string) {
  const router = useNavigate();

   const getChatLog = async () => {
    const { data } = await axios.get<Message[]>(`http://localhost:8080/chat/room/${roomId}`);
    return data;
  }

  return useQuery<Message[], Error>({
    queryKey: `ChatLog/${roomId}`,
    queryFn: getChatLog,
    onError: (err: any) => {
      if (err.response.status === 401 || err.response.status === 403)
        router('/chat/room');
    },
  })
}

export default useQueryChatLog;
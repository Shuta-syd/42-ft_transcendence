import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { Message } from "../../types/PrismaType";

function useMutationMessage(roomId: string) {
  const queryClient = useQueryClient();
  const router = useNavigate();

  type SendMessageDto = {
    senderName: string
    message: string
  }

  const createMessageMutation = useMutation(
    async (message: SendMessageDto) => {
      const res = await axios.post(`http://localhost:8080/chat/room/${roomId}` , message);
      return res.data;
    },
    {
      onSuccess: (res) => {
        const previousData = queryClient.getQueryData<Message[]>([`chatRoom${String(roomId)}`]);
        if (previousData)
          queryClient.setQueryData([`chatRoom${String(roomId)}`], [...previousData, res]);
      },
      onError: (err: any) => {
        if (err.response.status === 401 || err.response.status === 403)
          router('/chat');
      }
    }
  );

  return { createMessageMutation };
}

export default useMutationMessage;

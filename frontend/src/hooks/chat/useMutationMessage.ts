import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { Message } from "../../types/PrismaType";

function useMutationMessage(roomId: number) {
  const queryClient = useQueryClient();
  const router = useNavigate();

  const createMessageMutation = useMutation(
    async (message: Omit<Message, 'id' | 'createdAt'>) => {
      const res = await axios.post('http://localhost:8080/chat', message);
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

import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { Message } from "../../types/PrismaType";
import getNow from "../../utils/getNow";

function useMutationMessage(socket: Socket, roomId: string, memberId: string) {
  const queryClient = useQueryClient();
  const router = useNavigate();

  type SendMessageDto = {
    senderName: string
    message: string
  }

  const createMessageMutation = useMutation(
    async (message: SendMessageDto) => {
      const res = await axios.post(`http://localhost:8080/chat/room/${roomId}`, message);
      return res.data;
    },
    {
      onSuccess: (res) => {
        socket.emit('send_message_room', { memberId: res.memberId, senderName: res.senderName, text: res.message, time: getNow(), id: roomId })

        const previousData = queryClient.getQueryData<Message[]>([`chatRoom${String(roomId)}`]);
        if (previousData)
          queryClient.setQueryData([`chatRoom${String(roomId)}`], [...previousData, res]);
      },
      onError: (err: any) => {
        if (err.response.status === 401 || err.response.status === 403)
          router('/chat/room');
      }
    }
  );

  return { createMessageMutation };
}

export default useMutationMessage;

import axios from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/PrismaType";

function useQueryFriend(userId: string) {
  const router = useNavigate();

  const getFriends =async () => {
    const { data } = await axios.get<User[]>(`http://localhost:8080/user/friend/${userId}`);
    return data;
  }

  return useQuery<User[], Error>({
    queryKey: `user/friend/${userId}`,
    queryFn: getFriends,
    onError: (err: any) => {
      if (err.response.status === 401 || err.response.status === 403)
        router('/');
    }
  })
}

export default useQueryFriend;

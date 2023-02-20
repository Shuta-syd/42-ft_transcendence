import axios from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/PrismaType";

function useQueryUser(userId: string) {
  const router = useNavigate();

  const getUser =async () => {
    const { data } = await axios.get<User>(`http://localhost:8080/user/${userId}`);
    return data;
  }

  return useQuery<User, Error>({
    queryKey: `user/${userId}`,
    queryFn: getUser,
    onError: (err: any) => {
      if (err.response.status === 401 || err.response.status === 403)
        router('/');
    }
  })
}

export default useQueryUser;

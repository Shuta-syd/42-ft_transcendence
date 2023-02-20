import axios from "axios";
// import { useQuery } from "react-query";
// import { useNavigate } from "react-router-dom";
import { User } from "../../types/PrismaType";

function useQueryUserGame(userid: string) {
    // const router = useNavigate();

    const getUser = async () => {
        const { data } = await axios.get<User>(`http://localhost:8080/user/${userid}`);
        return data;
    }

    return getUser();
}

export default useQueryUserGame;

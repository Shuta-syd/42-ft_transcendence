import axios from "axios";
import { User } from "../../types/PrismaType";

function useQueryUserGame(userid: string) {
    const getUser = async () => {
        const { data } = await axios.get<User>(`http://localhost:8080/user/${userid}`);
        return data;
    }

    return getUser();
}

export default useQueryUserGame;

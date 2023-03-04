import axios from "axios";
import {User} from "../../types/PrismaType";

function useGameUser() {
    const getMatches = async () => {
        const { data } = await axios.get<User>(`http://localhost:8080/user`);
        return data;
    }
    return getMatches();
}

export default useGameUser;

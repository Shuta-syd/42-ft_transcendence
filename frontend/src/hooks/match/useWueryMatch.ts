import axios from "axios";
import { Match } from "../../types/PrismaType";
/*
axiosを使ってbackend(nestjs)とhttp通信を行う
またaxios.getとすることでGetメソッドをリクエストとして指定できる
バックエンド側では@Getのように指定することで特定のメソッドに対して、
レスポンスを送ることができる
 */

function useQueryMatches() {
    const getMatches = async () => {
        const { data } = await axios.get<Match[]>(`http://localhost:8080/match`);
        return data;
    }
    return getMatches();
}

export default useQueryMatches;

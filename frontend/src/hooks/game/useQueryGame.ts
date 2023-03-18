import axios from "axios";
import { User } from "../../types/PrismaType";

/*
axiosを使ってbackend(nestjs)とhttp通信を行う
またaxios.getとすることでGetメソッドをリクエストとして指定できる
バックエンド側では@Getのように指定することで特定のメソッドに対して、
レスポンスを送ることができる
 */
function useQueryUserGame(userid: string) {
    const getUser = async () => {
        // {}で囲むことによってaxios.getメソッドのレスポンスからdata propertyのみ受け取れる
        const { data } = await axios.get<User>(`http://localhost:8080/user/${userid}`);
        return data;
    }
    return getUser();
}

export default { useQueryUserGame };

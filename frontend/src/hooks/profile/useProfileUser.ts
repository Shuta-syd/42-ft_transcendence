import axios from 'axios';
import { User } from '../../types/PrismaType';

/*
機能としてはgetGameUserと全く同じだが、profile様に
userをとってくるための関数として作成.今後一緒にしてもいいかも
 */
export const useProfileUser = () => {
    const fetchProfileUser = async () => {
        const { data } = await axios.get<User>(`http://localhost:8080/user`);
        return data;
    }
    return fetchProfileUser();
}

export default useProfileUser;

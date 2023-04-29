import axios from "axios";
import { Match } from "../../types/PrismaType";

function useQueryMatches() {
    const getMatches = async () => {
        const { data } = await axios.get<Match[]>(`http://localhost:8080/match`);
        return data;
    }
    return getMatches();
}

export default useQueryMatches;

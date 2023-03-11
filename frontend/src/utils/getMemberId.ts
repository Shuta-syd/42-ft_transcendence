import axios from "axios";

const getMemberId = async (roomId: string): Promise<string> => {
  const res = await axios.get(`http://localhost:8080/chat/room/${roomId}/memberId`)
  return res.data;
};

export default getMemberId;

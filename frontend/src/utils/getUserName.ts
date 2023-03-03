import axios from "axios";

async function getUserName(): Promise<string> {
  const res = await axios.get(`http://localhost:8080/user`);
  return res.data.name;
}

export default getUserName ;

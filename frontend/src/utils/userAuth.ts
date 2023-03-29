import axios from "axios";

export default async function userAuth(): Promise<boolean> {
  const { data } = await axios.get('http://localhost:8080/user');

  if (data.id === '')
    return false;
  return true;
}

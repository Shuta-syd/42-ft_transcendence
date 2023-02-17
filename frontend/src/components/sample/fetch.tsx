import React, { useEffect, useState } from "react";

const fetchUsers = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  return res.json();
}

function FetchComponent() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers().then((data) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setUsers(data);
    }).catch((e) => {console.log(e)});
  }, []);

  return (
    <>
      <h2>ユーザー覧</h2>
      <div>
        {users.map((user: any) => (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    </>
  );
}

export default FetchComponent;

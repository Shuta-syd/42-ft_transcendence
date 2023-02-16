import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery } from "react-query";

const fetchUsers = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  return res.json();
}

function ReactQueryComponent() {
  const ret = useQuery('users', fetchUsers);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data } = ret;
  return (
    <>
      <h2>ユーザ一覧</h2>
      <div>
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          data.map((user: any) => (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    </>
  );
}

export default ReactQueryComponent;

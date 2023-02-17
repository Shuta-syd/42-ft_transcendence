import React from "react";
import useQueryChat from "../../hooks/chat/useQueryChat";


function ReactQueryComponent() {
  const { data } = useQueryChat(1);
  console.log(data);
  return (
    <>
      <h2>ユーザ一覧</h2>
      <div>
        {data?.map((obj, idx) => (
          <div key={obj.id}>{obj.message}</div>
        ))}
      </div>
    </>
  );
}

export default ReactQueryComponent;

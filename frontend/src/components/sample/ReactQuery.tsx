import { Button } from "@mui/material";
import React from "react";
import useMutationMessage from "../../hooks/chat/useMutationMessage";
import useQueryChat from "../../hooks/chat/useQueryChat";


function ReactQueryComponent() {
  const { data } = useQueryChat(1);
  const { createMessageMutation } = useMutationMessage(1);

  const SendChat = () => {
    console.log('Message Emit');
    createMessageMutation.mutate({
      message: "42 Paris",
      roomId: 1,
      userId: 1,
    });
  }

  console.log(data);
  return (
    <>
      <h2>ユーザ一覧</h2>
      <div>
        {data?.map((obj, idx) => (
          <div key={obj.id}>{obj.userId} {obj.message}</div>
        ))}
      </div>
      <Button variant="contained" onClick={SendChat}>Emit</Button>
    </>
  );
}

export default ReactQueryComponent;

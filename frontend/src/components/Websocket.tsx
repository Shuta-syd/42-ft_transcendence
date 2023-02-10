import { Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../contexts/WebsocketContext"

type MessagePayload = {
  content: string;
  msg: string;
};


export default function Websocket() {
  const [value, setValue] = useState('');
  const [messages, setMessage] = useState<MessagePayload[]>([]);
  const socket = useContext(WebsocketContext); // type is Socket

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected!');
      console.log(socket.connect());
    });

    socket.on('onMessage', (newMessage : MessagePayload) => {
      console.log('onMessage event received!');
      setMessage((prev) => [...prev, newMessage]);
    });

    return () => {
      console.log('Unregistering Events');
      socket.off('connect');
      socket.off('onMessage');
    }
  }, [])

  const onSubmit = () => {
    socket.emit('send_message', value);
    setValue('');
  }

  return (
    <div>
      <h1>Websocket Component</h1>
      <div>
        {messages.length === 0 ?
          <div>No Message</div> :
          <div>
            {messages.map((msg, key) => <div key={key}>{msg.content}</div>)}
          </div>
        }
      </div>
      <TextField fullWidth label='...' variant="outlined"
        onChange={(e) => setValue(e.target.value)}
      />
      <Button variant="contained"
        onClick={onSubmit}
      >Emit</Button>
    </div>
  )
}

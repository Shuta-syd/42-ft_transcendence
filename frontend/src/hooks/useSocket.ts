import * as React from 'react';
import { io, Socket } from 'socket.io-client';

export default function useSocket(uri: string): Socket {
  const { current: socket } = React.useRef<Socket>(
    io(uri, {
      autoConnect: false,
      transports: ['websocket'],
    })
  );

  React.useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return socket;
};

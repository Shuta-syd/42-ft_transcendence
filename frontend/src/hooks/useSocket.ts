import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export default function useSocket(uri: string): Socket {
  const { current: socket } = useRef<Socket>(
    io(uri, {
      autoConnect: false,
      transports: ['websocket'],
    })
  );

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return socket;
};

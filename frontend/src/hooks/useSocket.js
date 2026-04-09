import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

let socketInstance = null;

export function useSocket() {
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    if (!socketInstance) {
      socketInstance = io('http://localhost:5000', {
        auth: { userId: user.id },
        transports: ['websocket'],
      });
    }
    socketRef.current = socketInstance;

    return () => {};
  }, [user]);

  return socketRef.current;
}

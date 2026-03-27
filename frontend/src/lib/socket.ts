import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const serverUrl = baseUrl.replace(/\/api\/?$/, '');
    socket = io(serverUrl, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      auth: {
        token: localStorage.getItem('authToken'),
      },
    });
  }
  return socket;
};

export const connectSocket = () => {
  const sock = getSocket();
  if (!sock.connected) {
    sock.auth = { token: localStorage.getItem('authToken') };
    sock.connect();
  }
  return sock;
};


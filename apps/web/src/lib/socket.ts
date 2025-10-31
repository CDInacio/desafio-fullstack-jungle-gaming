//apps/web/src/lib/socket.ts

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function createSocket(accessToken?: string) {
  if (socket) return socket;

  const url =
    import.meta.env.NEXT_PUBLIC_NOTIFICATIONS_WS_URL ||
    "<http://localhost:3004>";
  socket = io(url, {
    auth: {
      token: accessToken,
    },
    transports: ["websocket"],
    reconnection: true,
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

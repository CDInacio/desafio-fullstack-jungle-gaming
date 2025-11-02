import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function createSocket(userId?: string) {
  if (socket) return socket;

  const url =
    import.meta.env.VITE_NOTIFICATIONS_WS_URL || "http://localhost:3005";

  socket = io(url, {
    auth: {
      userId: userId, // ✅ Enviar userId diretamente
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

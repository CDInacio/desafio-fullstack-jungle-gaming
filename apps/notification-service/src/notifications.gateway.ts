import { Injectable, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('NotificationsGateway');
  private userSockets = new Map<string, Set<string>>();

  // ✅ Removido: constructor com JwtService

  async handleConnection(client: Socket) {
    try {
      // ✅ Receber userId diretamente (sem JWT)
      const userId =
        client.handshake.auth?.userId ||
        (client.handshake.query?.userId as string);

      if (!userId) {
        this.logger.warn(`Connection rejected: No userId provided`);
        client.disconnect();
        return;
      }

      // Join room with userId
      client.join(this.roomForUser(userId));

      // Save socket id
      const sockets = this.userSockets.get(userId) || new Set<string>();
      sockets.add(client.id);
      this.userSockets.set(userId, sockets);

      this.logger.log(`User ${userId} connected (socket ${client.id})`);
    } catch (error) {
      this.logger.warn(`Connection rejected: ${error.message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        this.logger.log(`User ${userId} disconnected (socket ${client.id})`);
      }
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  emitToUsers(event: string, payload: any, userIds: string[] | number[]) {
    if (!userIds || userIds.length === 0) return;

    this.logger.log(`Emitting ${event} to users: ${userIds.join(', ')}`);

    for (const id of userIds) {
      const room = this.roomForUser(String(id));
      this.server.to(room).emit(event, payload);
    }
  }

  private roomForUser(userId: string) {
    return `user:${userId}`;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

interface DecodedToken {
  sub?: string | number;
  email?: string;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_ORIGIN,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('NotificationsGateway');

  private userSockets = new Map<string, Set<string>>();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token || client.handshake.query?.token;

      if (!token) {
        this.logger.warn(`Connection rejected: No token provided`);
        client.disconnect();
        return;
      }

      const decoded = this.jwtService.verify<DecodedToken>(token as string, {
        secret: process.env.JWT_SECRET,
      });

      const userId = String(decoded.sub || decoded['userId'] || decoded['id']);

      if (!userId) {
        this.logger.warn(`Connection rejected: Token has no user identifier`);
        client.disconnect();
        return;
      }

      // join room with userId
      client.join(this.roomForUser(userId));

      //save socket id
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
      if (sockets.has(client.id)) sockets.delete(client.id);
      if (sockets.size === 0) this.userSockets.delete(userId);
      this.logger.log(`User ${userId} disconnected (socket ${client.id})`);
      break;
    }
  }

  emitToUsers(event: string, payload: any, userIds: string[] | number[]) {
    if (!userIds || userIds.length === 0) return;
    console.log(userIds, event, payload);
    for (const id of userIds) {
      const room = this.roomForUser(String(id));
      this.server.to(room).emit(event, payload);
    }
  }

  private roomForUser(userId: string) {
    return `user:${userId}`;
  }
}

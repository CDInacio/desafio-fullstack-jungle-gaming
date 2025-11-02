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

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // trecho dentro de handleConnection antes de verificar
      const token =
        client.handshake.auth?.token || client.handshake.query?.token;
      this.logger.log(`Token received: ${token ? 'yes' : 'no'}`);
      if (token) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(
              Buffer.from(parts[1], 'base64').toString(),
            );
            const exp = payload.exp
              ? new Date(payload.exp * 1000).toISOString()
              : 'no-exp';
            this.logger.log(`Token payload sub=${payload.sub} exp=${exp}`);
          } else {
            this.logger.warn('Token is not a valid JWT (not 3 parts)');
          }
        } catch (err) {
          this.logger.warn('Failed to decode token for debug: ' + err.message);
        }
      }
      if (!token) {
        this.logger.warn(`Connection rejected: No token provided`);
        client.disconnect();
        return;
      }

      if (!process.env.JWT_SECRET) {
        this.logger.warn(
          'Connection rejected: JWT_SECRET is not set in environment',
        );
        client.disconnect();
        return;
      }

      const decoded = this.jwtService.verify<DecodedToken>(token as string, {
        secret: process.env.JWT_SECRET,
      });
      this.logger.log(`Token decoded successfully`);
      this.logger.log(`Decoded token: ${JSON.stringify(decoded)}`);
      if (!decoded)
        this.logger.log(`Decoded token: ${JSON.stringify(decoded)}`);

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
    // console.log(userIds, event, payload);
    for (const id of userIds) {
      const room = this.roomForUser(String(id));
      this.server.to(room).emit(event, payload);
    }
  }

  private roomForUser(userId: string) {
    return `user:${userId}`;
  }
}

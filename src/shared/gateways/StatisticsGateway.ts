import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Throttle } from '@nestjs/throttler';
import env from '@config/env';

@WebSocketGateway({
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        env.BACKOFFICE_URL,
        'https://sigsaude.apps.pm.pb.gov.br',
        'http://localhost:3000',
      ];

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.match(/^http:\/\/localhost:/)
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
})
export class StatisticsGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() server: Server;

  afterInit() {
    console.log('Gateway inicializado');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log('Client connected', client.id);
  }

  @Throttle({ default: { limit: 1, ttl: 5000 } })
  notifyStatsUpdated() {
    console.log('Stats updated event received');
    this.server.emit('statsUpdated', { updated: true });
  }
}

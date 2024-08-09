import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { EventsService } from '@shared/events/EventsService';
import { Socket, Server } from 'socket.io';
import { Throttle } from '@nestjs/throttler';
import env from '@config/env';

@WebSocketGateway({
  cors: {
    origin: [env.BACKOFFICE_URL, 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class StatisticsGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(private eventsService: EventsService) {}

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

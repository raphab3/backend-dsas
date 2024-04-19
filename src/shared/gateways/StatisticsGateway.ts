import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { EventsService } from '@shared/events/EventsService';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
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

  async onModuleInit() {
    // Emitir estatísticas atualizadas periodicamente ou sob demanda
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log('Client connected', client.id);
    // Emitir imediatamente as estatísticas atuais quando o cliente se conectar
    this.eventsService.emit('statsUpdated');
  }

  sendUpdatedStats(data: any) {
    console.log('Emitindo evento de atualização de estatísticas', data);
    this.server.emit('updateStats', data);
  }
}

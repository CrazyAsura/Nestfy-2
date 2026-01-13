import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatbotService } from './chatbot.service';

@WebSocketGateway({
  cors: {
    origin: [
      'https://nestfy-1.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
})
export class ChatbotGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatbotService: ChatbotService) { }

  afterInit(server: Server) {
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { message: string; userId?: string; sessionId?: string },
  ) {
    const sessionId = data.sessionId || client.id;
    console.log(`Message received from ${client.id} (Session: ${sessionId}):`, data.message);
    try {
      const response = await this.chatbotService.getResponse(data.message, data.userId, sessionId);
      client.emit('receiveMessage', {
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        sessionId: sessionId,
      });

      // Salvar no banco de dados
      await this.chatbotService.create({
        query: data.message,
        response: response,
        userId: data.userId || null,
        sessionId: sessionId,
      });
    } catch (error) {
      console.error('Error in chatbot gateway:', error);
      client.emit('error', { message: 'Erro ao processar mensagem' });
    }
  }
}

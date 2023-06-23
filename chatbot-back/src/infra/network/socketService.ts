// infra/network/SocketService.ts
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { ChatbotUsecase } from '../../domain/usecase/chatbot'

const { CROSS_ORIGIN_URL } = process.env

export class SocketService {
  private server = createServer();
  private io: Server | null = null;

  constructor(private chatbotUsecase: ChatbotUsecase) {}

  public start() {
    this.io = new Server(this.server, {
      cors: {
        origin: `${CROSS_ORIGIN_URL}`, // Here you define which origins are allowed
        methods: ["GET", "POST"] // And which HTTP methods are allowed
      }
    });
    this.io.on('connection', this.handleConnection);
    this.server.listen(3000, () => console.log('Socket.IO server is running on port 3000.'));
  }

  private handleConnection = (socket: Socket) => {
    console.log('A client connected.');

    socket.on('message', async (message) => {
      try {
        const response = await this.chatbotUsecase.requestResponse(message);
        socket.emit('response', response);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('disconnect', () => console.log('A client disconnected.'));
  }
}

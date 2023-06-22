// index.ts
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { ChatbotUsecase } from './domain/usecase/chatbot';
import { SocketService } from './infra/network/socketService';
import routes from './domain/rest';

const app = express();
const port = 8088;
const chatbotUsecase = new ChatbotUsecase();
const socketService = new SocketService(chatbotUsecase);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

app.listen(port, () => console.info("Port 8088"));
socketService.start();

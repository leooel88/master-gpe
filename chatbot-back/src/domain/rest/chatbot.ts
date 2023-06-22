import { Router } from 'express';
import { ChatbotUsecase } from '../usecase/chatbot'

const chatbotRouter = Router();

const chatbotUsecase = new ChatbotUsecase()

chatbotRouter.get('/', (req, res) => chatbotUsecase.hello(req, res));


export default chatbotRouter;
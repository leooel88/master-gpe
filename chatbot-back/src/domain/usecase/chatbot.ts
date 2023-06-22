// domain/usecase/chatbot.ts
import { ChatbotPort } from '../port/chatbotPort';
import { ChatGPTFitTunedAdapter } from '../../infra/chatgpt/chatGPTFitTunedAdapter';

export class ChatbotUsecase {
  private readonly chatbotPort: ChatbotPort;

  constructor() {
    this.chatbotPort = new ChatGPTFitTunedAdapter();
  }

  public hello(req, res): void {
    this.chatbotPort.hello();
    res.status(200).send("Hello world !")
  }

  public async requestResponse(message: string): Promise<{ response: string; }> {
    return await this.chatbotPort.requestResponse(message);
  }
}

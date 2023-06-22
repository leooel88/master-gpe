import { ChatbotPort } from '../../domain/port/chatbotPort'
import { Configuration, OpenAIApi } from "openai";

const { OPENAI_API_KEY, OPENAI_API_ORGANIZATION } = process.env
const apiKey = `${OPENAI_API_KEY}`;

export class ChatGPTAdapter implements ChatbotPort {
    readonly configuration: Configuration
    readonly openai: OpenAIApi
    constructor() {
        this.configuration = new Configuration({ apiKey: apiKey, organization: `${OPENAI_API_ORGANIZATION}` })
        this.openai = new OpenAIApi(this.configuration)
    }

    hello(): void {
        console.log("Hello world !!");
    }

    async requestResponse(message: string): Promise<{ response: string }> {
        const chat_completion = await this.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
        });
        console.log(chat_completion.data.choices)
        const generatedText = chat_completion.data.choices[0].message.content;
        const response = { response: generatedText.trim() };
        return response;
    }
}

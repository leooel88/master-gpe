import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { makeChain } from '../utils/makechain';
import { getPineconeClient } from '../utils/pinecone-client';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '../../config/pinecone';
import { ChatbotPort } from '../../domain/port/chatbotPort'

export class ChatGPTFitTunedAdapter implements ChatbotPort {
  hello(): void {
    console.log("Hello world !")
  }

  async requestResponse(message: string): Promise<{ response: string; }> {
    const sanitizedQuestion = message.trim().replace(/\n/g, ' ');
    try {
      const pinecone = await getPineconeClient();
      const index = pinecone.Index(PINECONE_INDEX_NAME);

      /* create vectorstore*/
      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({}),
        {
          pineconeIndex: index,
          textKey: 'text',
          namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
        },
      );

      //create chain
      const chain = makeChain(vectorStore);
      //Ask a question using chat history
      const response = await chain.call({
        question: sanitizedQuestion,
        chat_history: [],
      });

      console.log('response', response);
      return { response: response.text }
    } catch (error: any) {
      console.log('error', error);
      throw "Something went wrong while requesting to chatgpt..."
    }
  }
}
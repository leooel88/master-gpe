import { PineconeClient } from '@pinecone-database/pinecone/dist';

let pinecone: PineconeClient | null = null;

async function initializePinecone() {
  if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
    throw new Error('Pinecone environment or api key vars missing');
  }

  try {
    pinecone = new PineconeClient();

    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? '',
      apiKey: process.env.PINECONE_API_KEY ?? '',
    });
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to initialize Pinecone Client');
  }
}

export async function getPineconeClient(): Promise<PineconeClient> {
  if (!pinecone) {
    await initializePinecone();
  }

  return pinecone!;
}

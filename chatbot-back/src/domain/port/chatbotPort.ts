export interface ChatbotPort {
    hello(): void
    requestResponse(message: string): Promise<{ response: string }>
}
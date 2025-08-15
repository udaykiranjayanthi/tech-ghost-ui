export interface Message {
  messageId: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt?: string;
}

export interface Conversation extends Message {
  userId: string;
}

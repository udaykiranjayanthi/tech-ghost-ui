export interface Message {
  messageId: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt?: string;
  isRead?: boolean;
  readAt?: string;
}

export interface Conversation extends Message {
  userId: string;
  isUserOnline: boolean;
}

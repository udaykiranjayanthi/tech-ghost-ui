export interface User {
  userId: string;
  username: string;
  email: string;
  pictureUrl: string;
  firstName: string;
  lastName: string;
  // message related
  lastMessage?: string;
  lastMessageTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  messageId: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt?: string;
}

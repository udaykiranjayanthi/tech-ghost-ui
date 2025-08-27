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

export interface NextCursor {
  cursor: string;
}

export interface MessagesPaginationState {
  data: Message[];
  nextCursorCreatedAt: string;
  nextCursorId: string;
  hasNext: boolean;
  isLoading: boolean;
}

export interface AcknowledgementResponse<T> {
  success: boolean;
  data: T;
  error: string;
}

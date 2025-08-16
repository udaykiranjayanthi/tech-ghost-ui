import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Flex,
  Button,
  Center,
  Text,
  Card,
  Stack,
  Box,
} from "@mantine/core";
import { CloudXIcon, UserPlusIcon } from "@phosphor-icons/react";
import { io, Socket } from "socket.io-client";
import { useNavigate, useParams } from "react-router";
import { ChatUserList } from "./ChatUserList";
import { ChatWindow } from "./ChatWindow";
import NewChat from "./NewChat";
import type { Message, Conversation } from "./types";
import styles from "./styles.module.scss";
import { useGlobalStore } from "@/store";
import { useApiQuery } from "@/services/hooks";
import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import type { UserData } from "@/types";

export const Messages: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [usersDetails, setUsersDetails] = useState<Record<string, UserData>>(
    {}
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newChatOpened, setNewChatOpened] = useState(false);

  const { userId } = useGlobalStore.use.userDetails?.() ?? {};
  const { chatUserId = "" } = useParams<{ chatUserId?: string }>();
  const navigate = useNavigate();

  const userIds = useMemo(() => {
    const ids = conversations.map((conv) => conv.userId);
    if (chatUserId && !ids.includes(chatUserId)) {
      ids.push(chatUserId);
    }
    return ids;
  }, [conversations, chatUserId]);

  const { data: usersData } = useApiQuery<UserData[]>({
    url: ENDPOINTS.USERS_DATA,
    queryKey: [RQ_KEYS.USERS_DATA, userIds.join(",")],
    params: { userIds: userIds.join(",") },
    options: {
      enabled: !!userIds.length,
    },
  });

  useEffect(() => {
    if (usersData) {
      const users = usersData.reduce((acc, user) => {
        acc[user.userId] = user;
        return acc;
      }, {} as Record<string, UserData>);
      setUsersDetails(users);
    }
  }, [usersData]);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      auth: {
        token: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setConnectionError(true);
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setConnectionError(false);
    });

    setSocket(newSocket);

    newSocket.emit("registerUser");

    newSocket.emit("getRecentConversations");

    newSocket.on(
      "recentConversations",
      (recentConversations: Conversation[]) => {
        setConversations(recentConversations);
      }
    );

    newSocket.on("messageHistory", (messages: Message[]) => {
      setMessages(messages);
    });

    newSocket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      setConversations((prev) => {
        const otherUserId =
          message.senderId === userId ? message.receiverId : message.senderId;
        const conversationIndex = prev.findIndex(
          (conv) => conv.userId === otherUserId
        );

        if (conversationIndex === -1) {
          // Create new conversation if it doesn't exist
          return [
            ...prev,
            { ...message, userId: otherUserId, isUserOnline: true },
          ];
        }

        // Update existing conversation
        const updatedConversations = [...prev];
        updatedConversations[conversationIndex] = {
          ...message,
          userId: otherUserId,
          isUserOnline: true,
        };
        return updatedConversations;
      });
    });

    newSocket.on("readReceipt", (message: Message) => {
      setMessages((prev) => {
        const updatedMessages = [...prev];
        const messageIndex = updatedMessages.findIndex(
          (msg) => msg.messageId === message.messageId
        );
        if (messageIndex !== -1) {
          const existingMessage = updatedMessages[messageIndex];
          // Only update if the read status or timestamp has actually changed
          if (existingMessage.isRead !== message.isRead) {
            updatedMessages[messageIndex] = {
              ...existingMessage,
              isRead: message.isRead,
              readAt: message.readAt,
            };
            return updatedMessages;
          }
        }
        return prev; // Return original state if no changes needed
      });
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (chatUserId && socket) {
      socket.emit("getMessageHistory", {
        userId: chatUserId,
      });
    }
  }, [chatUserId, socket]);

  const handleUserSelect = (selectedId: string | null) => {
    if (selectedId) {
      navigate(`/messages/${selectedId}`);
    } else {
      navigate(`/messages`);
    }
  };

  const handleSendMessage = (message: string) => {
    if (socket && chatUserId) {
      const payload: Partial<Message> = {
        senderId: userId,
        receiverId: chatUserId,
        message,
      };
      socket.emit("sendMessage", payload);
    }
  };

  const handleSendReadReceipt = (messageId: string) => {
    if (socket && messageId) {
      socket.emit("updateReadReceipt", {
        messageId,
      });
    }
  };

  const selectedUser = usersDetails[chatUserId ?? ""];

  if (connectionError) {
    return (
      <Container size="lg" p="0" h="100%" className={styles.container}>
        <Card shadow="sm" p="xl" radius="md" h="100%">
          <Center h="100%">
            <Stack align="center">
              <Box c="dimmed">
                <CloudXIcon size={64} />
              </Box>
              <Text ta="center" c="red.6">
                Error connecting to the chat server. Please try again later.
              </Text>
            </Stack>
          </Center>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="lg" p="0" h="100%" className={styles.container}>
      <Flex gap="md" h="100%">
        <div className={styles.chatListContainer}>
          <Button
            leftSection={<UserPlusIcon size={20} />}
            variant="light"
            onClick={() => setNewChatOpened(true)}
            mb="md"
            fullWidth
          >
            New Chat
          </Button>
          <ChatUserList
            conversations={conversations}
            usersDetails={usersDetails}
            selectedUserId={chatUserId}
            onUserSelect={handleUserSelect}
          />
        </div>
        <ChatWindow
          selectedUser={selectedUser}
          messages={messages}
          onSendMessage={handleSendMessage}
          onMessageRead={handleSendReadReceipt}
        />
      </Flex>
      <NewChat opened={newChatOpened} onClose={() => setNewChatOpened(false)} />
    </Container>
  );
};

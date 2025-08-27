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
import { useNavigate, useParams } from "react-router";
import { ChatUserList } from "./ChatUserList";
import { ChatWindow } from "./ChatWindow";
import NewChat from "./NewChat";
import type {
  Message,
  Conversation,
  MessagesPaginationState,
  AcknowledgementResponse,
} from "./types";
import styles from "./styles.module.scss";
import { useGlobalStore } from "@/store";
import { useApiQuery } from "@/services/hooks";
import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import type { Pagination, UserData } from "@/types";
import { socket } from "@/services/socket";

export const Messages: React.FC = () => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [usersDetails, setUsersDetails] = useState<Record<string, UserData>>(
    {}
  );
  const [messages, setMessages] = useState<MessagesPaginationState>({
    data: [],
    nextCursorCreatedAt: "",
    nextCursorId: "",
    hasNext: true,
    isLoading: false,
  });
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

  const loadMessages = ({ loadMore = false }: { loadMore?: boolean }) => {
    if (
      messages.isLoading ||
      (!messages.hasNext && loadMore) ||
      !socketConnected
    )
      return;

    setMessages((prev) => ({
      ...prev,
      isLoading: true,
    }));

    socket.emit(
      "getMessageHistory",
      {
        userId: chatUserId,
        limit: 5,
        ...(loadMore && {
          nextCursorCreatedAt: messages.nextCursorCreatedAt,
          nextCursorId: messages.nextCursorId,
        }),
      },
      (response: AcknowledgementResponse<Pagination<Message>>) => {
        try {
          if (response.success) {
            const { data, nextCursorCreatedAt, nextCursorId } = response.data;
            const newData = data.reverse();

            if (loadMore) {
              setMessages((prev) => ({
                data: [...newData, ...prev.data],
                nextCursorCreatedAt,
                nextCursorId,
                hasNext: !!nextCursorCreatedAt,
                isLoading: false,
              }));
            } else {
              setMessages(() => ({
                data: newData,
                nextCursorCreatedAt,
                nextCursorId,
                hasNext: !!nextCursorCreatedAt,
                isLoading: false,
              }));
            }
          } else {
            console.error("Error loading messages:", response.error);
          }
        } catch (error) {
          console.error("Error processing messages:", error);
        } finally {
          setMessages((prev) => ({
            ...prev,
            isLoading: false,
          }));
        }
      }
    );
  };

  // Handle socket connection
  useEffect(() => {
    socket.connect();

    socket.on("connect_error", () => {
      setSocketConnected(false);
      setConnectionError(true);
    });

    socket.on("connect", () => {
      setSocketConnected(true);
      setConnectionError(false);
    });

    socket.emit("registerUser");

    socket.emit("getRecentConversations");

    return () => {
      socket.close();
    };
  }, []);

  // Add socket event listeners
  useEffect(() => {
    socket.on("recentConversations", (recentConversations: Conversation[]) => {
      setConversations(recentConversations);
    });

    socket.on("receiveMessage", (message: Message) => {
      const otherUserId =
        message.senderId === userId ? message.receiverId : message.senderId;

      if (otherUserId === chatUserId) {
        setMessages((prev) => ({
          ...prev,
          data: [...prev.data, message],
        }));
      }

      setConversations((prev) => {
        const conversationIndex = prev.findIndex(
          (conv) => conv.userId === otherUserId
        );

        if (conversationIndex === -1) {
          // Create new conversation if it doesn't exist and prepend
          return [
            { ...message, userId: otherUserId, isUserOnline: true },
            ...prev,
          ];
        }

        // Update existing conversation and reorder such that recent messages comes on top
        const updatedConversations = [...prev];
        updatedConversations.splice(conversationIndex, 1);

        updatedConversations.unshift({
          ...message,
          userId: otherUserId,
          isUserOnline: true,
        });
        return updatedConversations;
      });
    });

    socket.on("readReceipt", (message: Message) => {
      setMessages((prev) => {
        const updatedMessages = [...prev.data];
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
            return {
              ...prev,
              data: updatedMessages,
            };
          }
        }
        return prev; // Return original state if no changes needed
      });
    });

    return () => {
      socket.off("recentConversations");
      socket.off("receiveMessage");
      socket.off("readReceipt");
    };
  }, [chatUserId]);

  useEffect(() => {
    if (chatUserId && socketConnected) {
      loadMessages({});
    }
  }, [chatUserId, socketConnected]);

  const handleUserSelect = (selectedId: string | null) => {
    setMessages({
      data: [],
      nextCursorCreatedAt: "",
      nextCursorId: "",
      hasNext: true,
      isLoading: false,
    });
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
          loadMessages={loadMessages}
        />
      </Flex>
      <NewChat opened={newChatOpened} onClose={() => setNewChatOpened(false)} />
    </Container>
  );
};

import React, { useEffect, useMemo, useState } from "react";
import { Container, Flex } from "@mantine/core";
import { io, Socket } from "socket.io-client";
import { useSearchParams } from "react-router";
import { ChatUserList } from "./ChatUserList";
import { ChatWindow } from "./ChatWindow";
import type { Message, Conversation } from "./types";
import styles from "./styles.module.scss";
import { useGlobalStore } from "@/store";
import { useApiQuery } from "@/services/hooks";
import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import type { UserData } from "@/types";

export const Messages: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [usersDetails, setUsersDetails] = useState<Record<string, UserData>>(
    {}
  );
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const { userId } = useGlobalStore.use.userDetails?.() ?? {};

  const userIds = useMemo(() => {
    return conversations.map((conv) => conv.userId);
  }, [conversations]);

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
    const chatUserId = searchParams.get("chatUserId");
    if (chatUserId) {
      handleUserSelect(chatUserId);
    }
  }, [searchParams]);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.emit("registerUser", userId);

    newSocket.emit("getRecentConversations", userId);

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
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleUserSelect = (selectedId: string | null) => {
    setSelectedUserId(selectedId);
    if (selectedId) {
      socket?.emit("getMessageHistory", {
        userId1: userId,
        userId2: selectedId,
      });
    } else {
      setMessages([]);
    }
  };

  const handleSendMessage = (message: string) => {
    if (socket && selectedUserId) {
      const payload: Partial<Message> = {
        senderId: userId,
        receiverId: selectedUserId,
        message,
      };
      socket.emit("sendMessage", payload);
    }
  };

  const selectedUser = usersDetails[selectedUserId ?? ""];

  return (
    <Container size="lg" p="0" h="100%" className={styles.container}>
      <Flex flex={1} gap="md" mih="0">
        <ChatUserList
          conversations={conversations}
          usersDetails={usersDetails}
          selectedUserId={selectedUserId}
          onUserSelect={handleUserSelect}
        />
        <ChatWindow
          selectedUser={selectedUser}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </Flex>
    </Container>
  );
};

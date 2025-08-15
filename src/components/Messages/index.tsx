import React, { useEffect, useState } from "react";
import { Container, Flex } from "@mantine/core";
import { io, Socket } from "socket.io-client";
import { useSearchParams } from "react-router";
import { ChatUserList } from "./ChatUserList";
import { ChatWindow } from "./ChatWindow";
import type { Message, User } from "./types";
import styles from "./styles.module.scss";
import { useGlobalStore } from "@/store";

const dummyUsers = [
  {
    userId: "b9bfe8db-ee22-46f4-a85d-69597cb905a8",
    username: "user_ec6029e0",
    email: "n160099@rguktn.ac.in",
    pictureUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocKQAma5yJN08ctV5WANtd6KM6xxWxXsjpqXY51jOE6XztBz32M=s96-c",
    firstName: "UDAYKIRAN",
    lastName: "JAYANTHI",

    lastMessage: "Hello",
    lastMessageTime: "2025-08-15T09:35:49.479637Z",
    createdAt: "2025-08-15T09:35:49.479637Z",
    updatedAt: "2025-08-15T09:35:49.479637Z",
  },
];

export const Messages: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const { userId } = useGlobalStore.use.userDetails?.() ?? {};

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

    newSocket.on("users", (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

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

  const selectedUser = users.find((user) => user.userId === selectedUserId);

  return (
    <Container size="lg" p="0" h="100%" className={styles.container}>
      <Flex flex={1} gap="md" mih="0">
        <ChatUserList
          users={users}
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

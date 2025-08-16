import React, { useEffect, useMemo, useState } from "react";
import { Container, Flex, Button } from "@mantine/core";
import { UserPlusIcon } from "@phosphor-icons/react";
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

  useEffect(() => {
    if (chatUserId && socket) {
      console.log("chatUserId", chatUserId);
      socket.emit("getMessageHistory", {
        userId1: userId,
        userId2: chatUserId,
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

  const selectedUser = usersDetails[chatUserId ?? ""];

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
        />
      </Flex>
      <NewChat opened={newChatOpened} onClose={() => setNewChatOpened(false)} />
    </Container>
  );
};

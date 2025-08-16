import React, { useEffect, useRef } from "react";
import { Card, Center, ScrollArea, Stack, Text } from "@mantine/core";
import type { Message } from "./types";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import styles from "./styles.module.scss";
import type { UserData } from "@/types";

interface ChatWindowProps {
  selectedUser?: UserData;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedUser,
  messages,
  onSendMessage,
}) => {
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewport.current && messages.length > 0) {
      // Add a small delay to ensure the component is fully rendered
      viewport.current?.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, selectedUser]);

  if (!selectedUser) {
    return (
      <Card className={styles.chatWindow}>
        <Center h="100%">
          <Text ta="center" c="dimmed">
            Select a user to start chatting
          </Text>
        </Center>
      </Card>
    );
  }

  return (
    <Card className={styles.chatWindow}>
      <Card.Section className={styles.chatHeader}>
        <Text fw={500}>
          {selectedUser?.firstName} {selectedUser?.lastName}
        </Text>
      </Card.Section>

      <ScrollArea viewportRef={viewport} className={styles.messageArea}>
        <Stack gap="md" p="md">
          {messages.map((message) => (
            <ChatMessage key={message.messageId} message={message} />
          ))}
        </Stack>
      </ScrollArea>

      <Card.Section className={styles.chatFooter}>
        <ChatInput onSendMessage={onSendMessage} />
      </Card.Section>
    </Card>
  );
};

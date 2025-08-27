import React, { useEffect, useRef } from "react";
import {
  Avatar,
  Button,
  Card,
  Center,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import styles from "./styles.module.scss";
import type { UserData } from "@/types";
import type { MessagesPaginationState } from "./types";

interface ChatWindowProps {
  selectedUser?: UserData;
  messages: MessagesPaginationState;
  onSendMessage: (message: string) => void;
  onMessageRead: (messageId: string) => void;
  loadMessages: ({ loadMore }: { loadMore?: boolean }) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedUser,
  messages,
  onSendMessage,
  onMessageRead,
  loadMessages,
}) => {
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewport.current && messages.data.length > 0) {
      // First scroll instantly to bottom
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, [selectedUser]);

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
      <Card.Section className={styles.chatHeader} bg="gray.8">
        <Group wrap="nowrap">
          <Avatar
            src={selectedUser.pictureUrl}
            radius="xl"
            size="md"
            name={selectedUser.firstName + " " + selectedUser.lastName}
            color="initials"
          />
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              {selectedUser.firstName} {selectedUser.lastName}
            </Text>
            <Text size="xs" c="dimmed">
              @{selectedUser.username}
            </Text>
          </div>
        </Group>
      </Card.Section>

      <ScrollArea viewportRef={viewport} className={styles.messageArea}>
        <Stack gap="xs" p="md">
          {messages.hasNext && (
            <Flex justify="center">
              <Button
                variant="light"
                size="xs"
                onClick={() => loadMessages({ loadMore: true })}
              >
                Load More
              </Button>
            </Flex>
          )}
          {messages.data.map((message) => (
            <ChatMessage
              key={message.messageId}
              message={message}
              onMessageRead={onMessageRead}
            />
          ))}
        </Stack>
      </ScrollArea>

      <Card.Section className={styles.chatFooter}>
        <ChatInput onSendMessage={onSendMessage} />
      </Card.Section>
    </Card>
  );
};

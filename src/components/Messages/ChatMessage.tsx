import React, { useEffect } from "react";
import { Group, Paper, Text } from "@mantine/core";
import type { Message } from "./types";
import classes from "./styles.module.scss";
import { displayDate } from "@/services/utils";
import { useGlobalStore } from "@/store";

interface ChatMessageProps {
  message: Message;
  onMessageRead: (messageId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onMessageRead,
}) => {
  const { userId } = useGlobalStore.use.userDetails?.() ?? {};
  const isMessageOwn = message.senderId === userId;

  const ref = React.createRef<HTMLDivElement>();

  useEffect(() => {
    // Only setup observer if message is unread and not our own
    if (message.isRead || isMessageOwn) return;

    // Add a small delay before setting up the observer to allow initial scroll to complete
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            onMessageRead(message.messageId);
            observer.disconnect(); // stop observing after sending read receipt
          }
        },
        { threshold: 0.7 } // 70% visible to count as "read"
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timeoutId);
    };
  }, [ref, onMessageRead, message]);

  return (
    <div
      ref={ref}
      className={`${classes.messageContainer} ${
        isMessageOwn ? classes.own : ""
      }`}
    >
      <Paper className={classes.message} p="xs">
        <Text size="sm">{message.message}</Text>

        <Group
          gap="xs"
          justify={isMessageOwn ? "right" : "left"}
          align="center"
        >
          {message.isRead && isMessageOwn && (
            <Text size="xs" c="dimmed">
              Seen
            </Text>
          )}
          <Text size="xs" c="dimmed">
            {displayDate(message.createdAt)}
          </Text>
        </Group>
      </Paper>
    </div>
  );
};

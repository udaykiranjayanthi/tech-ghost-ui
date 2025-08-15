import React from "react";
import { Paper, Text } from "@mantine/core";
import type { Message } from "./types";
import classes from "./styles.module.scss";
import { displayDate } from "@/services/utils";
import { useGlobalStore } from "@/store";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { userId } = useGlobalStore.use.userDetails?.() ?? {};
  const isMessageOwn = message.senderId === userId;

  return (
    <div
      className={`${classes.messageContainer} ${
        isMessageOwn ? classes.own : ""
      }`}
    >
      <Paper className={classes.message} p="xs">
        <Text size="sm">{message.message}</Text>
        <Text size="xs" c="dimmed" ta={isMessageOwn ? "right" : "left"}>
          {displayDate(message.createdAt)}
        </Text>
      </Paper>
    </div>
  );
};

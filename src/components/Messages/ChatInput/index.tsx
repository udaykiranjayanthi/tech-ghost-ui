import React, { useState } from "react";
import { Textarea, ActionIcon, Group } from "@mantine/core";
import { PaperPlaneRightIcon } from "@phosphor-icons/react";
import styles from "./styles.module.scss";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        onSendMessage(message.trim());
        setMessage("");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.chatInput}>
      <Group gap="xs" align="flex-end">
        <Textarea
          placeholder="Type a message... (Shift+Enter for new line)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1 }}
          variant="filled"
          autoFocus
          autosize
          maxRows={8}
          minRows={1}
        />
        <ActionIcon
          type="submit"
          variant="filled"
          size="lg"
          disabled={!message.trim()}
        >
          <PaperPlaneRightIcon size={20} />
        </ActionIcon>
      </Group>
    </form>
  );
};

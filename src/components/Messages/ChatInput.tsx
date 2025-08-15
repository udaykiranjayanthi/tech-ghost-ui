import React, { useState } from "react";
import { TextInput, ActionIcon, Group } from "@mantine/core";
import { PaperPlaneRightIcon } from "@phosphor-icons/react";
import classes from "./styles.module.scss";

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

  return (
    <form onSubmit={handleSubmit} className={classes.chatInput}>
      <Group gap="xs">
        <TextInput
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: 1 }}
          variant="filled"
          autoFocus
        />
        <ActionIcon
          type="submit"
          variant="filled"
          color="blue"
          size="lg"
          disabled={!message.trim()}
        >
          <PaperPlaneRightIcon size={20} />
        </ActionIcon>
      </Group>
    </form>
  );
};

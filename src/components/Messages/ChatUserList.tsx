import React from "react";
import { ScrollArea, Stack } from "@mantine/core";
import type { UserData } from "@/types";
import styles from "./styles.module.scss";
import type { Conversation } from "./types";
import { ChatUserCard } from "./ChatUserCard";

interface ChatUserListProps {
  conversations: Conversation[];
  usersDetails: Record<string, UserData>;
  selectedUserId?: string | null;
  onUserSelect: (userId: string | null) => void;
}

export const ChatUserList: React.FC<ChatUserListProps> = ({
  conversations,
  usersDetails,
  selectedUserId,
  onUserSelect,
}) => {
  const handleUserSelect = (userId: string) => {
    if (selectedUserId === userId) {
      onUserSelect(null);
    } else {
      onUserSelect(userId);
    }
  };
  return (
    <ScrollArea className={styles.userList}>
      <Stack gap="xs">
        {conversations.map((conversation) => (
          <ChatUserCard
            key={conversation.userId}
            conversation={conversation}
            userDetails={usersDetails[conversation.userId]}
            isSelected={selectedUserId === conversation.userId}
            onSelect={handleUserSelect}
          />
        ))}
      </Stack>
    </ScrollArea>
  );
};

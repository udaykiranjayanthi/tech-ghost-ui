import React, { useMemo, useState } from "react";
import { ScrollArea, Stack, TextInput, Text } from "@mantine/core";
import type { UserData } from "@/types";
import styles from "./styles.module.scss";
import type { Conversation } from "./types";
import { ChatUserCard } from "./ChatUserCard";
import { useDebouncedValue } from "@mantine/hooks";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300);

  const filteredConversations = useMemo(() => {
    if (!debouncedQuery || !usersDetails) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      if (!usersDetails[conversation.userId]) {
        return false;
      }
      const user = usersDetails[conversation.userId];
      return (user.firstName + " " + user.lastName)
        .toLowerCase()
        .includes(debouncedQuery.toLowerCase());
    });
  }, [conversations, debouncedQuery, usersDetails]);

  const handleUserSelect = (userId: string) => {
    if (userId === selectedUserId) {
      onUserSelect(null);
    } else {
      onUserSelect(userId);
    }
  };

  const showNewChatUser = useMemo(() => {
    if (!selectedUserId || !usersDetails[selectedUserId]) return false;
    return !conversations.some((conv) => conv.userId === selectedUserId);
  }, [selectedUserId, conversations, usersDetails]);

  return (
    <ScrollArea className={styles.userList}>
      <TextInput
        placeholder="Search"
        leftSection={<MagnifyingGlassIcon size={16} />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
        mb="md"
      />
      <Stack gap="xs">
        {showNewChatUser && (
          <>
            <Text size="sm" fw={500} c="dimmed">
              New Conversation
            </Text>
            <ChatUserCard
              key={selectedUserId}
              conversation={{
                userId: selectedUserId!,
                message: "",
                messageId: "new",
                senderId: "",
                receiverId: "",
                isUserOnline: false,
              }}
              userDetails={usersDetails[selectedUserId!]}
              isSelected={true}
              onSelect={handleUserSelect}
            />
          </>
        )}
        {filteredConversations.length > 0 && showNewChatUser && (
          <Text size="sm" fw={500} c="dimmed">
            Recent Chats
          </Text>
        )}
        {filteredConversations.map((conversation) => (
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

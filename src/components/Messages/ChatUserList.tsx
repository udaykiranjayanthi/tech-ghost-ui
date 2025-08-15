import React from "react";
import { ScrollArea, Stack, Avatar, Text, Group, Card } from "@mantine/core";
import type { User } from "./types";
import { displayDate } from "@/services/utils";
import styles from "./styles.module.scss";

interface ChatUserListProps {
  users: User[];
  selectedUserId?: string | null;
  onUserSelect: (userId: string | null) => void;
}

export const ChatUserList: React.FC<ChatUserListProps> = ({
  users,
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
        {users.map((user) => (
          <Card
            key={user.userId}
            withBorder={selectedUserId === user.userId}
            onClick={() => handleUserSelect(user.userId)}
            className={styles.userCard}
          >
            <Group>
              <Avatar
                src={user.pictureUrl}
                name={user.firstName + " " + user.lastName}
                color="initials"
              />
              <div style={{ flex: 1 }}>
                <Group justify="space-between">
                  <Text size="sm" fw={500}>
                    {user.firstName + " " + user.lastName}
                  </Text>
                  {user.lastMessageTime && (
                    <Text size="xs" c="dimmed">
                      {displayDate(user.lastMessageTime)}
                    </Text>
                  )}
                </Group>
                {user.lastMessage && (
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {user.lastMessage}
                  </Text>
                )}
              </div>
            </Group>
          </Card>
        ))}
      </Stack>
    </ScrollArea>
  );
};

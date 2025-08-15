import { Avatar, Card, Group, Text, Skeleton } from "@mantine/core";
import type { Conversation } from "./types";
import type { UserData } from "../../types/user.types";
import { displayDate } from "@/services/utils";
import styles from "./styles.module.scss";

interface ChatUserCardProps {
  conversation: Conversation;
  userDetails: UserData;
  isSelected: boolean;
  onSelect: (userId: string) => void;
}

export const ChatUserCard = ({
  conversation,
  userDetails,
  isSelected,
  onSelect,
}: ChatUserCardProps) => {
  if (!userDetails) {
    return <Skeleton height={70} width="100%" />;
  }

  return (
    <Card
      onClick={() => onSelect(conversation.userId)}
      className={`${styles.userCard} ${isSelected ? styles.selected : ""}`}
    >
      <Group>
        <Avatar
          src={userDetails.pictureUrl}
          name={userDetails.firstName + " " + userDetails.lastName}
          color="initials"
        />
        <div style={{ flex: 1 }}>
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              {userDetails.firstName + " " + userDetails.lastName}
            </Text>
            {conversation.createdAt && (
              <Text size="xs" c="dimmed">
                {displayDate(conversation.createdAt)}
              </Text>
            )}
          </Group>
          {conversation.message && (
            <Text size="xs" c="dimmed" lineClamp={1}>
              {conversation.message}
            </Text>
          )}
        </div>
      </Group>
    </Card>
  );
};

import type { FC } from "react";
import { Card, Image, Text, Group, ActionIcon, Flex } from "@mantine/core";
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  ChatCircleIcon,
  BookmarkSimpleIcon,
  LinkIcon,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router";
import styles from "./styles.module.scss";
import { displayDate } from "@/services/utils";

interface PostCardProps {
  postId: string;
  title: string;
  thumbnailUrl: string;
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  createdAt: string;
  saved?: boolean;
}

export const PostCard: FC<PostCardProps> = ({
  postId,
  title,
  thumbnailUrl,
  upvotes,
  downvotes,
  commentsCount,
  createdAt,
  saved = false,
}) => {
  const navigate = useNavigate();

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add upvote functionality here
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add downvote functionality here
  };

  const handleCardClick = () => {
    navigate(`/post/${postId}`);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add save functionality here
  };

  const handleCopyLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText("link");
  };

  return (
    <Card className={styles.card} onClick={handleCardClick}>
      <Card.Section>
        <Image src={thumbnailUrl} height={160} alt={title} />
      </Card.Section>

      <Text className={styles.title} fw={500} lineClamp={2}>
        {title}
      </Text>

      <Group className={styles.footer} justify="space-between">
        <Flex gap="md" align="center">
          <Group gap="8" className={styles.likesGroup}>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={handleUpvote}
            >
              <ThumbsUpIcon size={18} />
            </ActionIcon>
            <Text size="sm" c="dimmed">
              {upvotes - downvotes}
            </Text>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={handleDownvote}
            >
              <ThumbsDownIcon size={18} />
            </ActionIcon>
          </Group>

          <Group gap="8">
            <ActionIcon variant="subtle" color="gray" size="sm">
              <ChatCircleIcon size={18} />
            </ActionIcon>
            <Text size="sm" c="dimmed">
              {commentsCount}
            </Text>
          </Group>
        </Flex>

        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color={saved ? "blue" : "gray"}
            size="sm"
            onClick={handleSaveClick}
          >
            <BookmarkSimpleIcon size={18} weight={saved ? "fill" : "regular"} />
          </ActionIcon>

          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={handleCopyLinkClick}
          >
            <LinkIcon size={18} />
          </ActionIcon>
        </Group>
      </Group>

      <Text size="xs" c="dimmed" className={styles.date}>
        {displayDate(createdAt)}
      </Text>
    </Card>
  );
};

import type { FC } from "react";
import { Card, Image, Text, Group, ActionIcon, Flex } from "@mantine/core";
import {
  ChatCircleIcon,
  BookmarkSimpleIcon,
  LinkIcon,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router";
import styles from "./styles.module.scss";
import { displayDate } from "@/services/utils";
import LikeDislike from "@/components/LikeDislike";

interface PostCardProps {
  postId: string;
  title: string;
  thumbnailUrl: string;
  likes: number;
  dislikes: number;
  userReaction: "LIKE" | "DISLIKE" | null;
  commentsCount: number;
  createdAt: string;
  saved?: boolean;
}

export const PostCard: FC<PostCardProps> = ({
  postId,
  title,
  thumbnailUrl,
  likes,
  dislikes,
  userReaction,
  commentsCount,
  createdAt,
  saved = false,
}) => {
  const navigate = useNavigate();

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
          <LikeDislike
            likes={likes}
            dislikes={dislikes}
            userReaction={userReaction}
            postId={postId}
          />

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

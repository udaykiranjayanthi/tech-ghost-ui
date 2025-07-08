import PostLikeDislike from "@/components/PostLikeDislike";
import PostSave from "@/components/PostSave";
import { displayDate } from "@/services/utils";
import { ActionIcon, Card, Flex, Group, Image, Text } from "@mantine/core";
import {
  ChatCircleIcon,
  LinkIcon
} from "@phosphor-icons/react";
import type { FC } from "react";
import { useNavigate } from "react-router";
import styles from "./styles.module.scss";

interface PostCardProps {
  postId: string;
  title: string;
  thumbnailUrl: string;
  likes: number;
  dislikes: number;
  userReaction: "LIKE" | "DISLIKE" | null;
  commentsCount: number;
  createdAt: string;
  saved: boolean;
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
  saved,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/post/${postId}`);
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
          <PostLikeDislike
            likes={likes}
            dislikes={dislikes}
            userReaction={userReaction}
            postId={postId}
          />

          <Group gap="8">
            <ActionIcon variant="subtle" color="gray" size="sm">
              <ChatCircleIcon size={20} />
            </ActionIcon>
            <Text size="sm" c="dimmed">
              {commentsCount}
            </Text>
          </Group>
        </Flex>

        <Group gap="xs">
          <PostSave postId={postId} saved={saved} />

          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={handleCopyLinkClick}
          >
            <LinkIcon size={20} />
          </ActionIcon>
        </Group>
      </Group>

      <Text size="xs" c="dimmed" className={styles.date}>
        {displayDate(createdAt)}
      </Text>
    </Card>
  );
};

import CopyLinkButton from "@/components/CopyLinkButton";
import PostLikeDislike from "@/components/PostLikeDislike";
import PostSave from "@/components/PostSave";
import { displayDate } from "@/services/utils";
import {
  ActionIcon,
  Card,
  Flex,
  Group,
  Image,
  Text,
  Tooltip,
} from "@mantine/core";
import { ChatCircleIcon } from "@phosphor-icons/react";
import type { FC } from "react";
import { NavLink, useNavigate } from "react-router";
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

  return (
    <Card className={styles.card} onClick={handleCardClick}>
      <Card.Section>
        <Image src={thumbnailUrl} height={160} alt={title} />
      </Card.Section>

      <Text className={styles.title} fw={500} lineClamp={2}>
        {title}
      </Text>

      <Group className={styles.footer} justify="space-between">
        <Flex gap="sm" align="center">
          <PostLikeDislike
            likes={likes}
            dislikes={dislikes}
            userReaction={userReaction}
            postId={postId}
          />

          <Group gap="4">
            <Tooltip label="View Comments" position="top" withArrow>
              <NavLink
                to={`/post/${postId}#comments`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <ActionIcon variant="subtle" color="gray" size="md">
                  <ChatCircleIcon size={20} />
                </ActionIcon>
              </NavLink>
            </Tooltip>
            <Text size="sm" c="dimmed">
              {commentsCount}
            </Text>
          </Group>
        </Flex>

        <Group gap="xs">
          <PostSave postId={postId} saved={saved} />

          <CopyLinkButton copyText={`http://localhost:3000/post/${postId}`} />
        </Group>
      </Group>

      <Text size="xs" c="dimmed" className={styles.date}>
        {displayDate(createdAt)}
      </Text>
    </Card>
  );
};

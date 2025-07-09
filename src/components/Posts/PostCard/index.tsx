import CopyLinkButton from "@/components/CopyLinkButton";
import PostLikeDislike from "@/components/PostLikeDislike";
import PostSave from "@/components/PostSave";
import { displayDate } from "@/services/utils";
import {
  ActionIcon,
  Avatar,
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
import type { UserData } from "@/types";
import ENDPOINTS from "@/common/endpoints";

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
  author: UserData;
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
  author,
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
            likeEndpoint={`${ENDPOINTS.POSTS}/${postId}/like`}
            dislikeEndpoint={`${ENDPOINTS.POSTS}/${postId}/dislike`}
          />

          <Group gap="4">
            <Tooltip label="View" position="top" withArrow>
              <NavLink
                className={styles.commentLink}
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

      <Group gap="xs" justify="space-between" className={styles.authorInfo}>
        <Group gap="xs">
          <Avatar src={author?.pictureUrl} size="xs" />
          <Text size="sm">
            {author?.firstName} {author?.lastName}
          </Text>
        </Group>

        <Text size="sm" c="dimmed">
          {displayDate(createdAt)}
        </Text>
      </Group>
    </Card>
  );
};

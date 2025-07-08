import { ActionIcon, Group, Text } from "@mantine/core";
import { ThumbsDownIcon, ThumbsUpIcon } from "@phosphor-icons/react";
import { useEffect, useState, type FC } from "react";
import styles from "./styles.module.scss";
import { useApiMutation } from "@/services/hooks";
import ENDPOINTS from "@/common/endpoints";

type PostLikeDislikeProps = {
  likes: number;
  dislikes: number;
  userReaction: "LIKE" | "DISLIKE" | null;
  postId: string;
};

const PostLikeDislike: FC<PostLikeDislikeProps> = ({
  likes,
  dislikes,
  userReaction,
  postId,
}) => {
  const [likesCount, setLikesCount] = useState(likes);
  const [dislikesCount, setDislikesCount] = useState(dislikes);
  const [reaction, setReaction] = useState<"LIKE" | "DISLIKE" | null>(
    userReaction
  );

  useEffect(() => {
    setLikesCount(likes);
    setDislikesCount(dislikes);
    setReaction(userReaction);
  }, [likes, dislikes, userReaction]);

  const { mutate: likePost } = useApiMutation({
    url: `${ENDPOINTS.POSTS}/${postId}/like`,
    method: "post",
    options: {
      onSuccess: () => {
        if (reaction === "DISLIKE") {
          setDislikesCount((prev) => prev - 1);
          setLikesCount((prev) => prev + 1);
          setReaction("LIKE");
        } else if (reaction === "LIKE") {
          setLikesCount((prev) => prev - 1);
          setReaction(null);
        } else {
          setLikesCount((prev) => prev + 1);
          setReaction("LIKE");
        }
      },
    },
  });

  const { mutate: dislikePost } = useApiMutation({
    url: `${ENDPOINTS.POSTS}/${postId}/dislike`,
    method: "post",
    options: {
      onSuccess: () => {
        if (reaction === "LIKE") {
          setLikesCount((prev) => prev - 1);
          setDislikesCount((prev) => prev + 1);
          setReaction("DISLIKE");
        } else if (reaction === "DISLIKE") {
          setDislikesCount((prev) => prev - 1);
          setReaction(null);
        } else {
          setDislikesCount((prev) => prev + 1);
          setReaction("DISLIKE");
        }
      },
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likePost({});
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    dislikePost({});
  };

  return (
    <Group gap="8" className={styles.likesGroup}>
      <ActionIcon
        variant="subtle"
        color={reaction === "LIKE" ? "blue" : "gray"}
        size="md"
        onClick={handleLike}
      >
        <ThumbsUpIcon
          size={20}
          weight={reaction === "LIKE" ? "fill" : "regular"}
        />
      </ActionIcon>
      <Text size="sm" c="dimmed">
        {likesCount - dislikesCount}
      </Text>
      <ActionIcon
        variant="subtle"
        color={reaction === "DISLIKE" ? "red" : "gray"}
        size="md"
        onClick={handleDislike}
      >
        <ThumbsDownIcon
          size={20}
          weight={reaction === "DISLIKE" ? "fill" : "regular"}
        />
      </ActionIcon>
    </Group>
  );
};

export default PostLikeDislike;

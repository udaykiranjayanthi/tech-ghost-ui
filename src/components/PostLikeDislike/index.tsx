import { ActionIcon, Group, Text, Tooltip } from "@mantine/core";
import { ThumbsDownIcon, ThumbsUpIcon } from "@phosphor-icons/react";
import { useEffect, useState, type FC } from "react";
import styles from "./styles.module.scss";
import { useApiMutation } from "@/services/hooks";

type PostLikeDislikeProps = {
  likes: number;
  dislikes: number;
  userReaction: "LIKE" | "DISLIKE" | null;
  likeEndpoint: string;
  dislikeEndpoint: string;
};

const PostLikeDislike: FC<PostLikeDislikeProps> = ({
  likes,
  dislikes,
  userReaction,
  likeEndpoint,
  dislikeEndpoint,
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
    url: likeEndpoint,
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
    url: dislikeEndpoint,
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
      <Tooltip label="Like" position="top" withArrow>
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
      </Tooltip>
      <Text size="sm" c="dimmed">
        {likesCount - dislikesCount}
      </Text>
      <Tooltip label="Dislike" position="top" withArrow>
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
      </Tooltip>
    </Group>
  );
};

export default PostLikeDislike;

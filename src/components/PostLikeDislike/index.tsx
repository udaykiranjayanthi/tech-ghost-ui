import { ActionIcon, Group, Text, Tooltip } from "@mantine/core";
import { ThumbsDownIcon, ThumbsUpIcon } from "@phosphor-icons/react";
import { useEffect, useState, type FC } from "react";
import styles from "./styles.module.scss";
import { useApiMutation } from "@/services/hooks";

type PostLikeDislikeProps = {
  likesCount: number;
  dislikesCount: number;
  userReaction: "LIKE" | "DISLIKE" | null;
  likeEndpoint: string;
  dislikeEndpoint: string;
};

const PostLikeDislike: FC<PostLikeDislikeProps> = ({
  likesCount,
  dislikesCount,
  userReaction,
  likeEndpoint,
  dislikeEndpoint,
}) => {
  const [likes, setLikes] = useState(likesCount);
  const [dislikes, setDislikes] = useState(dislikesCount);
  const [reaction, setReaction] = useState<"LIKE" | "DISLIKE" | null>(
    userReaction
  );

  useEffect(() => {
    setLikes(likesCount);
    setDislikes(dislikesCount);
    setReaction(userReaction);
  }, [likesCount, dislikesCount, userReaction]);

  const { mutate: likePost } = useApiMutation({
    url: likeEndpoint,
    method: "post",
    options: {
      onSuccess: () => {
        if (reaction === "DISLIKE") {
          setDislikes((prev) => prev - 1);
          setLikes((prev) => prev + 1);
          setReaction("LIKE");
        } else if (reaction === "LIKE") {
          setLikes((prev) => prev - 1);
          setReaction(null);
        } else {
          setLikes((prev) => prev + 1);
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
          setLikes((prev) => prev - 1);
          setDislikes((prev) => prev + 1);
          setReaction("DISLIKE");
        } else if (reaction === "DISLIKE") {
          setDislikes((prev) => prev - 1);
          setReaction(null);
        } else {
          setDislikes((prev) => prev + 1);
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
          color={reaction === "LIKE" ? "green" : "gray"}
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
        {likes - dislikes}
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

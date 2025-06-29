import type { FC } from "react";
import {
  Paper,
  Title,
  Text,
  Avatar,
  Group,
  Flex,
  ActionIcon,
  Divider,
  TextInput,
  Button,
  Box,
} from "@mantine/core";
import { ThumbsUpIcon, ThumbsDownIcon } from "@phosphor-icons/react";
import { useState } from "react";
import styles from "./styles.module.scss";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  upvotes: number;
  downvotes: number;
}

interface CommentsProps {
  comments: Comment[];
  postId: string;
}

export const Comments: FC<CommentsProps> = ({ comments, postId }) => {
  const [newComment, setNewComment] = useState("");

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.currentTarget.value);
  };

  const handleSubmitComment = () => {
    if (newComment.trim() === "") return;

    // In a real app, you would submit the comment to an API
    console.log("Submitting comment:", { postId, content: newComment });

    // Clear the input field after submission
    setNewComment("");
  };

  const handleUpvote = (commentId: string) => {
    // Add upvote functionality here
    console.log("Upvoting comment:", commentId);
  };

  const handleDownvote = (commentId: string) => {
    // Add downvote functionality here
    console.log("Downvoting comment:", commentId);
  };

  return (
    <Paper p="md" className={styles.commentsContainer}>
      <Title order={3} className={styles.commentsTitle}>
        Comments ({comments.length})
      </Title>

      <Box className={styles.newCommentSection}>
        <TextInput
          placeholder="Add a comment..."
          value={newComment}
          onChange={handleCommentChange}
          className={styles.commentInput}
        />
        <Button
          onClick={handleSubmitComment}
          disabled={newComment.trim() === ""}
        >
          Post
        </Button>
      </Box>

      <Divider my="md" />

      {comments.length > 0 ? (
        <div className={styles.commentsList}>
          {comments.map((comment) => (
            <Paper key={comment.id} className={styles.commentItem} withBorder>
              <Group justify="space-between" align="flex-start">
                <Group align="flex-start">
                  <Avatar
                    src={comment.avatar}
                    alt={comment.author}
                    radius="xl"
                  />
                  <div>
                    <Text fw={500}>{comment.author}</Text>
                    <Text size="xs" c="dimmed">
                      {comment.date}
                    </Text>
                    <Text className={styles.commentContent}>
                      {comment.content}
                    </Text>
                  </div>
                </Group>
                <Flex gap="xs">
                  <Group gap="4">
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      size="sm"
                      onClick={() => handleUpvote(comment.id)}
                    >
                      <ThumbsUpIcon size={16} />
                    </ActionIcon>
                    <Text size="sm" c="dimmed">
                      {comment.upvotes}
                    </Text>
                  </Group>
                  <Group gap="4">
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      size="sm"
                      onClick={() => handleDownvote(comment.id)}
                    >
                      <ThumbsDownIcon size={16} />
                    </ActionIcon>
                    <Text size="sm" c="dimmed">
                      {comment.downvotes}
                    </Text>
                  </Group>
                </Flex>
              </Group>
            </Paper>
          ))}
        </div>
      ) : (
        <Text c="dimmed" ta="center" py="xl">
          No comments yet. Be the first to comment!
        </Text>
      )}
    </Paper>
  );
};

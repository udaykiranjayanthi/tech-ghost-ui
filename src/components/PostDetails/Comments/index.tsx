import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import { useApiMutation, useApiQuery } from "@/services/hooks";
import type { Comment } from "@/types";
import {
  Box,
  Button,
  Divider,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import type { FC } from "react";
import { useState } from "react";
import CommentCard from "./CommentGroup";
import styles from "./styles.module.scss";
interface CommentsProps {
  postId: string;
}

export const Comments: FC<CommentsProps> = ({ postId }) => {
  const [newComment, setNewComment] = useState("");

  const { data } = useApiQuery<Comment[]>({
    url: `${ENDPOINTS.POSTS}/${postId}/comments`,
    params: { parentCommentId: null },
    queryKey: [RQ_KEYS.COMMENTS, postId],
  });

  const { mutate: addComment } = useApiMutation({
    url: `${ENDPOINTS.POSTS}/${postId}/comments`,
    method: "post",
  });

  const comments = data || [];

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.currentTarget.value);
  };

  const handleSubmitComment = () => {
    if (newComment.trim() === "") return;

    addComment(
      { payload: { content: newComment, parentCommentId: null } },
      {
        onSuccess: () => {
          setNewComment("");
        },
        onError: (error) => {
          console.error("Error adding comment:", error);
        },
      }
    );
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
            <CommentCard key={comment.commentId} comment={comment} />
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

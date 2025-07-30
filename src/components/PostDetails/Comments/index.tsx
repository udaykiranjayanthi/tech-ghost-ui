import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import { useApiMutation, useApiQuery } from "@/services/hooks";
import type { Comment, Pagination } from "@/types";
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
import CommentCard from "./CommentGroup";
import styles from "./styles.module.scss";
import { Controller, useForm } from "react-hook-form";
interface CommentsProps {
  postId: string;
}

export const Comments: FC<CommentsProps> = ({ postId }) => {
  const { data, refetch } = useApiQuery<Pagination<Comment>>({
    url: `${ENDPOINTS.POSTS}/${postId}/comments`,
    params: { parentCommentId: null },
    queryKey: [RQ_KEYS.COMMENTS, postId],
  });

  const { data: comments = [] } = data || {};

  const { mutate: addComment } = useApiMutation({
    url: `${ENDPOINTS.POSTS}/${postId}/comments`,
    method: "post",
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      content: "",
    },
  });

  const rules = {
    content: {
      required: "Required",
      maxLength: { value: 1000, message: "Max 1000 characters" },
    },
  };

  const handleSubmitComment = (data: { content: string }) => {
    const { content } = data;
    if (content.trim() === "") return;

    addComment(
      { payload: { content, parentCommentId: null } },
      {
        onSuccess: () => {
          reset();
          refetch();
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
        <Controller
          control={control}
          name="content"
          rules={rules.content}
          render={({ field }) => (
            <TextInput
              {...field}
              placeholder="Add a comment..."
              className={styles.commentInput}
            />
          )}
        />
        <Button onClick={handleSubmit(handleSubmitComment)} disabled={!isValid}>
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

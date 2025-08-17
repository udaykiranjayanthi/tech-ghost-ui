import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import { useApiInfiniteQuery, useApiMutation } from "@/services/hooks";
import type { Comment } from "@/types";
import {
  Box,
  Button,
  Divider,
  Flex,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import type { FC } from "react";
import CommentCard from "./CommentGroup";
import styles from "./styles.module.scss";
import { Controller, useForm } from "react-hook-form";
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
interface CommentsProps {
  postId: string;
}

export const Comments: FC<CommentsProps> = ({ postId }) => {
  const limit = 2;
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, refetch } =
    useApiInfiniteQuery<Comment>({
      url: `${ENDPOINTS.POSTS}/${postId}/comments`,
      queryKey: [RQ_KEYS.COMMENTS, postId],
      initialPageParam: null,
      params: {
        limit,
        parentCommentId: null,
      },
    });

  const comments = data?.pages?.flatMap((page) => page.data) ?? [];

  const { mutate: addComment } = useApiMutation({
    url: `${ENDPOINTS.POSTS}/${postId}/comments`,
    method: "post",
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty, errors },
  } = useForm({
    defaultValues: {
      content: "",
    },
    mode: "onChange",
  });

  const rules = {
    content: {
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
    <Box className={styles.commentsContainer}>
      <Flex gap="xs" align="center" mb="md" justify="space-between">
        <Title order={3} className={styles.commentsTitle} mb={0}>
          Comments ({comments.length})
        </Title>

        <Button
          variant="subtle"
          leftSection={<ArrowCounterClockwiseIcon size={24} />}
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </Flex>

      <Box className={styles.newCommentSection}>
        <Controller
          control={control}
          name="content"
          rules={rules.content}
          render={({ field }) => (
            <TextInput
              {...field}
              variant="filled"
              size="md"
              placeholder="Add a comment..."
              className={styles.commentInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handleSubmitComment)();
                }
              }}
              error={errors.content?.message}
            />
          )}
        />
        <Button
          size="md"
          onClick={handleSubmit(handleSubmitComment)}
          disabled={!isValid || !isDirty}
        >
          Post
        </Button>
      </Box>

      <Divider my="md" />

      {comments.length > 0 ? (
        <div>
          <div className={styles.commentsList}>
            {comments.map((comment) => (
              <CommentCard key={comment.commentId} comment={comment} />
            ))}
          </div>

          {hasNextPage && (
            <Flex justify="center" mt="md">
              <Button
                loading={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                Load More
              </Button>
            </Flex>
          )}
        </div>
      ) : (
        <Text c="dimmed" ta="center" py="xl">
          No comments yet. Be the first to comment!
        </Text>
      )}
    </Box>
  );
};

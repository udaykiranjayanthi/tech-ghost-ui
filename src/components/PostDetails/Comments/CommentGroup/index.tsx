import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import { useApiInfiniteQuery, useApiMutation } from "@/services/hooks";
import type { Comment } from "@/types";
import { Box, Button, Collapse, Flex, Text, TextInput } from "@mantine/core";
import { useState, type FC } from "react";
import CommentCard from "../CommentCard";
import styles from "./styles.module.scss";
import { Controller, useForm } from "react-hook-form";
import {
  ArrowBendUpLeftIcon,
  ArrowCounterClockwiseIcon,
  CaretDownIcon,
  CaretUpIcon,
} from "@phosphor-icons/react";

type CommentGroupProps = {
  comment: Comment;
};

const CommentGroup: FC<CommentGroupProps> = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const limit = 2;
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, refetch } =
    useApiInfiniteQuery<Comment>({
      url: `${ENDPOINTS.POSTS}/${comment.postId}/comments`,
      queryKey: [RQ_KEYS.COMMENTS, comment.postId, comment.commentId],
      initialPageParam: null,
      params: {
        limit,
        parentCommentId: comment.commentId,
      },
      options: {
        enabled: showReplies,
      },
    });

  const replies = data?.pages?.flatMap((page) => page.data) ?? [];

  const { mutate: addReply } = useApiMutation({
    url: `${ENDPOINTS.POSTS}/${comment.postId}/comments`,
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

  const toggleReplyInput = () => {
    if (showReplyInput) {
      setShowReplyInput(false);
      reset();
    } else {
      setShowReplyInput(true);
      reset();
    }
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleSubmitReply = (data: { content: string }) => {
    const { content } = data;
    if (content.trim() === "") return;

    addReply(
      {
        payload: { content: content, parentCommentId: comment.commentId },
      },
      {
        onSuccess: () => {
          reset();
          setShowReplyInput(false);
          // If replies are already loaded for this comment, refresh them
          if (!showReplies) {
            setShowReplies(true);
          }
          refetch();
        },
        onError: (error) => {
          console.error("Error adding reply:", error);
        },
      }
    );
  };

  const repliesCount = replies?.length || comment.repliesCount;

  return (
    <>
      <div key={comment.commentId} className={styles.commentWrapper}>
        <CommentCard comment={comment}>
          <Flex mt="md" gap="xs" align="center">
            <Button
              variant="subtle"
              size="xs"
              leftSection={<ArrowBendUpLeftIcon size={20} />}
              onClick={() => toggleReplyInput()}
            >
              Reply
            </Button>

            {repliesCount > 0 && (
              <Button
                variant="subtle"
                size="xs"
                rightSection={
                  showReplies ? (
                    <CaretUpIcon size={20} />
                  ) : (
                    <CaretDownIcon size={20} />
                  )
                }
                onClick={() => toggleReplies()}
              >
                {showReplies ? "Hide" : "View"} {repliesCount}{" "}
                {repliesCount === 1 ? "reply" : "replies"}
              </Button>
            )}

            {showReplies && (
              <Button
                variant="subtle"
                size="xs"
                leftSection={<ArrowCounterClockwiseIcon size={20} />}
                onClick={() => refetch()}
              >
                Refresh
              </Button>
            )}
          </Flex>

          {showReplyInput && (
            <Box className={styles.replyInputContainer}>
              <Controller
                control={control}
                name="content"
                rules={rules.content}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    placeholder="Write a reply..."
                    className={styles.replyInput}
                    variant="filled"
                    size="md"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(handleSubmitReply)();
                      }
                    }}
                    error={errors.content?.message}
                  />
                )}
              />
              <Flex gap="xs" justify="flex-end">
                <Button
                  size="xs"
                  variant="transparent"
                  onClick={() => toggleReplyInput()}
                >
                  Cancel
                </Button>
                <Button
                  size="xs"
                  onClick={handleSubmit(handleSubmitReply)}
                  disabled={!isValid || !isDirty}
                >
                  Reply
                </Button>
              </Flex>
            </Box>
          )}
        </CommentCard>

        <Collapse in={showReplies}>
          {replies.length > 0 ? (
            <div>
              <div className={styles.repliesContainer}>
                {replies?.map((reply) => (
                  <CommentCard key={reply.commentId} comment={reply} />
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
              No replies yet.
            </Text>
          )}
        </Collapse>
      </div>
    </>
  );
};

export default CommentGroup;

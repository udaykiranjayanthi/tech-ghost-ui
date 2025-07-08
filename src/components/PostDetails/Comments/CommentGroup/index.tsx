import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import { useApiMutation, useApiQuery } from "@/services/hooks";
import type { Comment } from "@/types";
import { Box, Button, Collapse, Divider, Flex, TextInput } from "@mantine/core";
import { useState, type FC } from "react";
import CommentCard from "../CommentCard";
import styles from "./styles.module.scss";
import { Controller, useForm } from "react-hook-form";
import {
  ArrowBendUpLeftIcon,
  CaretDownIcon,
  CaretUpIcon,
} from "@phosphor-icons/react";

type CommentGroupProps = {
  comment: Comment;
};

const CommentGroup: FC<CommentGroupProps> = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const { data: replies, refetch } = useApiQuery<Comment[]>({
    url: `${ENDPOINTS.POSTS}/${comment.postId}/comments`,
    queryKey: [RQ_KEYS.COMMENTS, comment.postId, comment.commentId],
    params: { parentCommentId: comment.commentId },
    options: {
      enabled: showReplies,
    },
  });

  const { mutate: addReply } = useApiMutation({
    url: `${ENDPOINTS.POSTS}/${comment.postId}/comments`,
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

  const handleLike = (commentId: string) => {
    console.log("Liking comment:", commentId);
  };

  const handleDislike = (commentId: string) => {
    console.log("Disliking comment:", commentId);
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

  return (
    <>
      <div key={comment.commentId} className={styles.commentWrapper}>
        <CommentCard
          comment={comment}
          handleLike={handleLike}
          handleDislike={handleDislike}
        >
          <Flex mt="md" gap="xs" align="center">
            <Button
              variant="subtle"
              size="xs"
              leftSection={<ArrowBendUpLeftIcon size={20} />}
              onClick={() => toggleReplyInput()}
            >
              Reply
            </Button>

            {comment.replyCount > 0 && (
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
                {showReplies ? "Hide" : "View"} {comment.replyCount}{" "}
                {comment.replyCount === 1 ? "reply" : "replies"}
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
                  />
                )}
              />
              <Flex gap="xs">
                <Button size="xs" onClick={() => toggleReplyInput()}>
                  Cancel
                </Button>
                <Button
                  size="xs"
                  onClick={handleSubmit(handleSubmitReply)}
                  disabled={!isValid}
                >
                  Reply
                </Button>
              </Flex>
            </Box>
          )}
        </CommentCard>

        <Collapse in={showReplies}>
          <div className={styles.repliesContainer}>
            {replies?.map((reply) => (
              <CommentCard
                key={reply.commentId}
                comment={reply}
                handleLike={handleLike}
                handleDislike={handleDislike}
              />
            ))}
          </div>
        </Collapse>
      </div>
    </>
  );
};

export default CommentGroup;

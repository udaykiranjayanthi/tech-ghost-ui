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
  Collapse,
} from "@mantine/core";
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  ChatCircleIcon,
  CaretDownIcon,
  CaretUpIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import styles from "./styles.module.scss";
import { useApiMutation, useApiQuery } from "@/services/hooks";
import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import type { UserData } from "@/types";
import { displayDate } from "@/services/utils";

interface Comment {
  commentId: string;
  author: UserData;
  content: string;
  createdAt: string;
  upvotes?: number;
  downvotes?: number;
  parentCommentId?: string | null;
  replyCount: number;
}

interface CommentsProps {
  postId: string;
}

export const Comments: FC<CommentsProps> = ({ postId }) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const [loadedReplies, setLoadedReplies] = useState<Record<string, Comment[]>>(
    {}
  );

  const { data } = useApiQuery<Comment[]>({
    url: `${ENDPOINTS.POSTS}/${postId}/comments`,
    params: { parentCommentId: null },
    queryKey: [RQ_KEYS.COMMENTS, postId],
  });

  const { mutate: addComment } = useApiMutation({
    url: `${ENDPOINTS.POSTS}/${postId}/comments`,
    method: "post",
  });

  const { mutate: loadReplies } = useApiMutation<Comment[]>({
    url: `${ENDPOINTS.POSTS}/${postId}/comments`,
    method: "get",
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

  const handleSubmitReply = (parentCommentId: string) => {
    if (replyContent.trim() === "") return;

    addComment(
      { payload: { content: replyContent, parentCommentId } },
      {
        onSuccess: () => {
          setReplyContent("");
          setReplyingTo(null);
          // If replies are already loaded for this comment, refresh them
          if (expandedComments[parentCommentId]) {
            handleLoadReplies(parentCommentId);
          }
        },
        onError: (error) => {
          console.error("Error adding reply:", error);
        },
      }
    );
  };

  const handleLoadReplies = (commentId: string) => {
    console.log("Loading replies for comment:", commentId);
    loadReplies(
      { params: { parentCommentId: commentId } },
      {
        onSuccess: (data) => {
          setLoadedReplies((prev) => ({
            ...prev,
            [commentId]: data,
          }));
          setExpandedComments((prev) => ({
            ...prev,
            [commentId]: true,
          }));
        },
        onError: (error) => {
          console.error("Error loading replies:", error);
        },
      }
    );
  };

  const toggleReplies = (commentId: string) => {
    if (!expandedComments[commentId]) {
      handleLoadReplies(commentId);
    } else {
      setExpandedComments((prev) => ({
        ...prev,
        [commentId]: false,
      }));
    }
  };

  const toggleReplyInput = (commentId: string | null) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    if (replyingTo !== commentId) {
      setReplyContent("");
    }
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
            <div key={comment.commentId} className={styles.commentWrapper}>
              <Paper className={styles.commentItem} withBorder>
                <Group justify="space-between" align="flex-start">
                  <Group align="flex-start">
                    <Avatar
                      src={comment?.author?.pictureUrl}
                      alt={comment?.author?.firstName}
                      radius="xl"
                    />
                    <div>
                      <Text fw={500}>{comment?.author?.firstName}</Text>
                      <Text size="xs" c="dimmed">
                        {displayDate(comment.createdAt)}
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
                        onClick={() => handleUpvote(comment.commentId)}
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
                        onClick={() => handleDownvote(comment.commentId)}
                      >
                        <ThumbsDownIcon size={16} />
                      </ActionIcon>
                      <Text size="sm" c="dimmed">
                        {comment.downvotes}
                      </Text>
                    </Group>
                  </Flex>
                </Group>

                <Flex mt="sm" gap="md" align="center">
                  <Button
                    variant="subtle"
                    size="xs"
                    leftSection={<ChatCircleIcon size={14} />}
                    onClick={() => toggleReplyInput(comment.commentId)}
                  >
                    Reply
                  </Button>

                  {comment.replyCount && comment.replyCount > 0 && (
                    <Button
                      variant="subtle"
                      size="xs"
                      rightSection={
                        expandedComments[comment.commentId] ? (
                          <CaretUpIcon size={14} />
                        ) : (
                          <CaretDownIcon size={14} />
                        )
                      }
                      onClick={() => toggleReplies(comment.commentId)}
                    >
                      {expandedComments[comment.commentId] ? "Hide" : "View"}{" "}
                      {comment.replyCount}{" "}
                      {comment.replyCount === 1 ? "reply" : "replies"}
                    </Button>
                  )}
                </Flex>

                {replyingTo === comment.commentId && (
                  <Box className={styles.replyInputContainer}>
                    <TextInput
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.currentTarget.value)}
                      className={styles.replyInput}
                    />
                    <Flex gap="xs">
                      <Button size="xs" onClick={() => toggleReplyInput(null)}>
                        Cancel
                      </Button>
                      <Button
                        size="xs"
                        onClick={() => handleSubmitReply(comment.commentId)}
                        disabled={replyContent.trim() === ""}
                      >
                        Reply
                      </Button>
                    </Flex>
                  </Box>
                )}
              </Paper>

              {/* Replies section */}
              <Collapse in={expandedComments[comment.commentId]}>
                <div className={styles.repliesContainer}>
                  {loadedReplies[comment.commentId]?.map((reply) => (
                    <Paper
                      key={reply.commentId}
                      className={styles.replyItem}
                      withBorder
                    >
                      <Group justify="space-between" align="flex-start">
                        <Group align="flex-start">
                          <Avatar
                            src={reply?.author?.pictureUrl}
                            alt={reply?.author?.firstName}
                            radius="xl"
                            size="sm"
                          />
                          <div>
                            <Text fw={500} size="sm">
                              {reply?.author?.firstName}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {displayDate(reply.createdAt)}
                            </Text>
                            <Text className={styles.commentContent} size="sm">
                              {reply.content}
                            </Text>
                          </div>
                        </Group>
                        <Flex gap="xs">
                          <Group gap="4">
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              size="sm"
                              onClick={() => handleUpvote(reply.commentId)}
                            >
                              <ThumbsUpIcon size={14} />
                            </ActionIcon>
                            <Text size="xs" c="dimmed">
                              {reply.upvotes}
                            </Text>
                          </Group>
                          <Group gap="4">
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              size="sm"
                              onClick={() => handleDownvote(reply.commentId)}
                            >
                              <ThumbsDownIcon size={14} />
                            </ActionIcon>
                            <Text size="xs" c="dimmed">
                              {reply.downvotes}
                            </Text>
                          </Group>
                        </Flex>
                      </Group>
                    </Paper>
                  ))}
                </div>
              </Collapse>
            </div>
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

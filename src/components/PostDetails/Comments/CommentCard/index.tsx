import { displayDate } from "@/services/utils";
import type { Comment } from "@/types";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Flex,
  Group,
  Paper,
  Text,
  TextInput,
} from "@mantine/core";
import {
  ArrowBendUpLeftIcon,
  CaretDownIcon,
  CaretUpIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@phosphor-icons/react";
import { type FC } from "react";
import styles from "./styles.module.scss";

type CommentCardProps = {
  comment: Comment;
  showReplyActions: boolean;
  handleUpvote: (commentId: string) => void;
  handleDownvote: (commentId: string) => void;
  showReplies?: boolean;
  showReplyInput?: boolean;
  replyContent?: string;
  setReplyContent?: (content: string) => void;
  toggleReplies?: () => void;
  toggleReplyInput?: () => void;
  handleSubmitReply?: () => void;
};

const CommentCard: FC<CommentCardProps> = ({
  comment,
  showReplyActions,
  handleUpvote,
  handleDownvote,
  showReplies,
  showReplyInput,
  replyContent,
  setReplyContent = () => {},
  toggleReplies = () => {},
  toggleReplyInput = () => {},
  handleSubmitReply = () => {},
}) => {
  return (
    <>
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
              <Text className={styles.commentContent}>{comment.content}</Text>
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
                <ThumbsUpIcon size={20} />
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
                <ThumbsDownIcon size={20} />
              </ActionIcon>
              <Text size="sm" c="dimmed">
                {comment.downvotes}
              </Text>
            </Group>
          </Flex>
        </Group>

        {showReplyActions && (
          <Flex mt="sm" gap="md" align="center">
            <Button
              variant="subtle"
              size="xs"
              leftSection={<ArrowBendUpLeftIcon size={20} />}
              onClick={() => toggleReplyInput()}
            >
              Reply
            </Button>

            {comment.replyCount && comment.replyCount > 0 && (
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
        )}

        {showReplyInput && (
          <Box className={styles.replyInputContainer}>
            <TextInput
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.currentTarget.value)}
              className={styles.replyInput}
            />
            <Flex gap="xs">
              <Button size="xs" onClick={() => toggleReplyInput()}>
                Cancel
              </Button>
              <Button
                size="xs"
                onClick={() => handleSubmitReply()}
                disabled={replyContent?.trim() === ""}
              >
                Reply
              </Button>
            </Flex>
          </Box>
        )}
      </Paper>
    </>
  );
};

export default CommentCard;

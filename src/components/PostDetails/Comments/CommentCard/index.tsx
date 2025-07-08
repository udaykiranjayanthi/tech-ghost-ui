import { displayDate } from "@/services/utils";
import type { Comment } from "@/types";
import {
  ActionIcon,
  Avatar,
  Box,
  Flex,
  Group,
  Paper,
  Text,
} from "@mantine/core";
import { ThumbsDownIcon, ThumbsUpIcon } from "@phosphor-icons/react";
import { type FC } from "react";
import styles from "./styles.module.scss";

type CommentCardProps = {
  comment: Comment;
  handleLike: (commentId: string) => void;
  handleDislike: (commentId: string) => void;
  children?: React.ReactNode | React.ReactNode[];
};

const CommentCard: FC<CommentCardProps> = ({
  comment,
  handleLike,
  handleDislike,
  children,
}) => {
  return (
    <>
      <Paper className={styles.commentItem} withBorder>
        <Group justify="space-between" align="flex-start">
          <Box flex={1}>
            <Group align="center" gap="xs">
              <Avatar
                src={comment?.author?.pictureUrl}
                size="md"
                alt={comment?.author?.firstName}
              />
              <div>
                <Text fw={500}>{comment?.author?.firstName}</Text>
                <Text size="xs" c="dimmed">
                  {displayDate(comment.createdAt)}
                </Text>
              </div>
            </Group>

            <Text className={styles.commentContent}>{comment.content}</Text>
          </Box>
          <Flex gap="xs">
            <Group gap="4">
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={() => handleLike(comment.commentId)}
              >
                <ThumbsUpIcon size={20} />
              </ActionIcon>
              <Text size="sm" c="dimmed">
                {comment.likes}
              </Text>
            </Group>
            <Group gap="4">
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={() => handleDislike(comment.commentId)}
              >
                <ThumbsDownIcon size={20} />
              </ActionIcon>
              <Text size="sm" c="dimmed">
                {comment.dislikes}
              </Text>
            </Group>
          </Flex>
        </Group>

        {children}
      </Paper>
    </>
  );
};

export default CommentCard;

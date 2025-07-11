import ENDPOINTS from "@/common/endpoints";
import PostLikeDislike from "@/components/PostLikeDislike";
import { displayDate } from "@/services/utils";
import type { Comment } from "@/types";
import { Avatar, Box, Group, Paper, Text } from "@mantine/core";
import { type FC } from "react";
import styles from "./styles.module.scss";

type CommentCardProps = {
  comment: Comment;
  children?: React.ReactNode | React.ReactNode[];
};

const CommentCard: FC<CommentCardProps> = ({ comment, children }) => {
  return (
    <>
      <Paper className={styles.commentItem} withBorder>
        <Group justify="space-between" align="flex-start">
          <Box flex={1}>
            <Group align="center" gap="xs">
              <Avatar
                src={comment?.author?.pictureUrl}
                size="md"
                name={
                  comment?.author?.firstName + " " + comment?.author?.lastName
                }
                color="initials"
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

          <PostLikeDislike
            likes={comment.likes}
            dislikes={comment.dislikes}
            userReaction={comment.userReaction}
            likeEndpoint={`${ENDPOINTS.POSTS}/${comment.postId}/comments/${comment.commentId}/like`}
            dislikeEndpoint={`${ENDPOINTS.POSTS}/${comment.postId}/comments/${comment.commentId}/dislike`}
          />
        </Group>

        {children}
      </Paper>
    </>
  );
};

export default CommentCard;

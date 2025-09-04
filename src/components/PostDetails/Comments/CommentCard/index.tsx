import ENDPOINTS from "@/common/endpoints";
import PostLikeDislike from "@/components/PostLikeDislike";
import { displayDate, handleError } from "@/services/utils";
import type { Comment } from "@/types";
import {
  Avatar,
  Box,
  Group,
  Paper,
  Text,
  Menu,
  ActionIcon,
} from "@mantine/core";
import { type FC } from "react";
import styles from "./styles.module.scss";
import { NavLink } from "react-router";
import {
  DotsThreeVerticalIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import { useGlobalStore } from "@/store";
import { useApiMutation } from "@/services/hooks";
import { notifications } from "@mantine/notifications";
import { AUTO_CLOSE_TIME } from "@/common/constants";

type CommentCardProps = {
  comment: Comment;
  refreshCommentsAndReplies: () => void;
  children?: React.ReactNode | React.ReactNode[];
};

const CommentCard: FC<CommentCardProps> = ({
  comment,
  refreshCommentsAndReplies,
  children,
}) => {
  const { userId } = useGlobalStore.use.userDetails?.() ?? {};
  const isAuthor = userId === comment?.author?.userId;

  const { mutate: deleteComment, isPending: isDeleting } = useApiMutation({
    url: `${ENDPOINTS.POSTS}/${comment.postId}/comments/${comment.commentId}`,
    method: "delete",
  });

  const handleDeleteComment = () => {
    deleteComment(
      {},
      {
        onSuccess: () => {
          notifications.show({
            position: "top-center",
            withCloseButton: true,
            autoClose: AUTO_CLOSE_TIME,
            title: "Success",
            message: "Comment deleted successfully",
            color: "green",
            icon: <CheckCircleIcon size={24} />,
          });
          refreshCommentsAndReplies();
        },
        onError: (error) => {
          handleError({ error });
        },
      }
    );
  };

  return (
    <>
      <Paper className={styles.commentItem} withBorder>
        <Group justify="space-between" align="flex-start">
          <Box flex={1}>
            <Group align="center" gap="xs">
              <NavLink to={`/profile/${comment?.author?.username}`}>
                <Avatar
                  src={comment?.author?.pictureUrl}
                  size="md"
                  name={
                    comment?.author?.firstName + " " + comment?.author?.lastName
                  }
                  color="initials"
                />
              </NavLink>
              <div>
                <NavLink to={`/profile/${comment?.author?.username}`}>
                  <Text fw={500}>
                    {comment?.author?.firstName +
                      " " +
                      comment?.author?.lastName}
                  </Text>
                </NavLink>
                <Text size="xs" c="dimmed">
                  {displayDate(comment.createdAt)}
                </Text>
              </div>
            </Group>

            <Text className={styles.commentContent}>{comment.content}</Text>
          </Box>

          <Group>
            {isAuthor && (
              <Menu position="bottom-end" withArrow>
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <DotsThreeVerticalIcon size={18} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    color="red"
                    leftSection={<TrashIcon size={16} />}
                    onClick={handleDeleteComment}
                    disabled={isDeleting}
                  >
                    Delete Comment
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
            <PostLikeDislike
              likesCount={comment.likesCount}
              dislikesCount={comment.dislikesCount}
              userReaction={comment.userReaction}
              likeEndpoint={`${ENDPOINTS.POSTS}/${comment.postId}/comments/${comment.commentId}/like`}
              dislikeEndpoint={`${ENDPOINTS.POSTS}/${comment.postId}/comments/${comment.commentId}/dislike`}
            />
          </Group>
        </Group>

        {children}
      </Paper>
    </>
  );
};

export default CommentCard;

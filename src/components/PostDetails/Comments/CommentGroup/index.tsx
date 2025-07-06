import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import { useApiMutation, useApiQuery } from "@/services/hooks";
import type { Comment } from "@/types";
import { Collapse } from "@mantine/core";
import { useState, type FC } from "react";
import CommentCard from "../CommentCard";
import styles from "./styles.module.scss";

type CommentGroupProps = {
  comment: Comment;
};

const CommentGroup: FC<CommentGroupProps> = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");

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

  const handleUpvote = (commentId: string) => {
    console.log("Upvoting comment:", commentId);
  };

  const handleDownvote = (commentId: string) => {
    console.log("Downvoting comment:", commentId);
  };

  const toggleReplyInput = () => {
    if (showReplyInput) {
      setShowReplyInput(false);
      setReplyContent("");
    } else {
      setShowReplyInput(true);
      setReplyContent("");
    }
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleSubmitReply = () => {
    if (replyContent.trim() === "") return;

    addReply(
      {
        payload: { content: replyContent, parentCommentId: comment.commentId },
      },
      {
        onSuccess: () => {
          setReplyContent("");
          setShowReplyInput(false);
          // If replies are already loaded for this comment, refresh them
          if (showReplies) {
            refetch();
          }
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
          showReplies={showReplies}
          showReplyInput={showReplyInput}
          replyContent={replyContent}
          setReplyContent={setReplyContent}
          handleUpvote={handleUpvote}
          handleDownvote={handleDownvote}
          toggleReplies={toggleReplies}
          toggleReplyInput={toggleReplyInput}
          handleSubmitReply={handleSubmitReply}
          showReplyActions={true}
        />
        <Collapse in={showReplies}>
          <div className={styles.repliesContainer}>
            {replies?.map((reply) => (
              <CommentCard
                key={reply.commentId}
                comment={comment}
                handleUpvote={handleUpvote}
                handleDownvote={handleDownvote}
                showReplyActions={false}
              />
            ))}
          </div>
        </Collapse>
      </div>
    </>
  );
};

export default CommentGroup;

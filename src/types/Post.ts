import type { UserData } from "./User";

export type PostData = {
  postId: string;
  title: string;
  thumbnailUrl: string;
  likes: number;
  dislikes: number;
  userReaction: "LIKE" | "DISLIKE" | null;
  commentsCount: number;
  createdAt: string;
  saved: boolean;
};

export type PostDetailsData = {
  postId: string;
  title: string;
  thumbnailUrl: string;
  likes: number;
  dislikes: number;
  userReaction: "LIKE" | "DISLIKE" | null;
  commentsCount: number;
  createdAt: string;
  saved: boolean;
  tldr: string;
  content: string;
  externalUrl?: string;
  includeExternalLink: boolean;
  hashtags: string[];
};

export type Comment = {
  commentId: string;
  postId: string;
  author: UserData;
  content: string;
  createdAt: string;
  likes?: number;
  dislikes?: number;
  userReaction?: "LIKE" | "DISLIKE" | null;
  parentCommentId?: string | null;
  replyCount: number;
};

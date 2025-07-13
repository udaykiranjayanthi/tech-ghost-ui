import type { UserData } from "./User";

export type PostData = {
  postId: string;
  title: string;
  thumbnailUrl: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  savesCount: number;
  userReaction: "LIKE" | "DISLIKE" | null;
  createdAt: string;
  saved: boolean;
  tldr: string;
  content: string;
  externalUrl?: string;
  includeExternalLink: boolean;
  hashtags: string[];
  author: UserData;
};

export type PostDetailsData = {
  postId: string;
  title: string;
  thumbnailUrl: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  savesCount: number;
  userReaction: "LIKE" | "DISLIKE" | null;
  createdAt: string;
  saved: boolean;
  tldr: string;
  content: string;
  externalUrl?: string;
  includeExternalLink: boolean;
  hashtags: string[];
  author: UserData;
};

export type Comment = {
  commentId: string;
  postId: string;
  author: UserData;
  content: string;
  createdAt: string;
  repliesCount: number;
  likesCount: number;
  dislikesCount: number;
  userReaction: "LIKE" | "DISLIKE" | null;
  parentCommentId?: string | null;
};

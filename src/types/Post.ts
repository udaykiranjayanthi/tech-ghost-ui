export type PostData = {
  postId: string;
  title: string;
  thumbnailUrl: string;
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  createdAt: string;
  saved?: boolean;
};

export type PostDetailsData = {
  postId: string;
  title: string;
  thumbnailUrl: string;
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  createdAt: string;
  saved?: boolean;
  tldr: string;
  content: string;
  externalUrl?: string;
  includeExternalLink: boolean;
  hashtags: string[];
};

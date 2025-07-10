export type UserData = {
  userId: string;
  username: string;
  email: string;
  pictureUrl: string;
  firstName: string;
  lastName: string;
};

export type UserDetailsData = {
  userId: string;
  username: string;
  email: string;
  pictureUrl: string;
  firstName: string;
  lastName: string;
  headline?: string | null;
  location?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
  following: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
};

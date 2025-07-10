import { RQ_KEYS } from "@/common/rqkeys";
import ENDPOINTS from "@/common/endpoints";
import { PostCard } from "@/components/Posts/PostCard";
import { useApiQuery } from "@/services/hooks";
import type { PostData } from "@/types";
import { Box, Button, SimpleGrid, Skeleton, Tabs, Text } from "@mantine/core";
import { type FC } from "react";
import styles from "./styles.module.scss";
import { SquaresFourIcon } from "@phosphor-icons/react";

interface UserPostsProps {
  userId: string | undefined;
  isCurrentUser: boolean;
}

const UserPosts: FC<UserPostsProps> = ({ userId, isCurrentUser }) => {
  // Fetch user's posts
  const { data: userPosts, isLoading: isLoadingPosts } = useApiQuery<
    PostData[]
  >({
    url: `${ENDPOINTS.POSTS}?userId=${userId || ""}`,
    queryKey: [RQ_KEYS.USER_POSTS, userId || ""],
    options: {
      enabled: !!userId,
    },
  });

  const showLoader = isLoadingPosts;
  const showPosts = !isLoadingPosts && userPosts && userPosts.length > 0;
  const showNoPosts =
    !isLoadingPosts && userPosts?.length === 0 && !isCurrentUser;
  const showNoPostsCreatePost =
    !isLoadingPosts && userPosts?.length === 0 && isCurrentUser;

  return (
    <Tabs defaultValue="posts" className={styles.postsSection}>
      <Tabs.List>
        <Tabs.Tab value="posts" leftSection={<SquaresFourIcon size={20} />}>
          <Text>User Posts</Text>
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="posts" pt="md" pb="md">
        {showLoader && (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height={322} radius="md" />
            ))}
          </SimpleGrid>
        )}
        {showPosts && (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {userPosts.map((post) => (
              <PostCard
                key={post.postId}
                postId={post.postId}
                title={post.title}
                thumbnailUrl={post.thumbnailUrl}
                likes={post.likes}
                dislikes={post.dislikes}
                userReaction={post.userReaction}
                commentsCount={post.commentsCount}
                createdAt={post.createdAt}
                saved={post.saved}
                author={post.author}
              />
            ))}
          </SimpleGrid>
        )}
        {showNoPosts && (
          <Box py="xl" ta="center">
            <Text size="lg" c="dimmed">
              No posts.
            </Text>
          </Box>
        )}
        {showNoPostsCreatePost && (
          <Box py="xl" ta="center">
            <Text size="lg" c="dimmed">
              You haven't created any posts yet.
            </Text>
            <Button
              variant="filled"
              mt="md"
              onClick={() => (window.location.href = "/create-post")}
            >
              Create Your First Post
            </Button>
          </Box>
        )}
      </Tabs.Panel>
    </Tabs>
  );
};

export default UserPosts;

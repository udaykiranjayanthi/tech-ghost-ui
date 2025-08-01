import type { FC } from "react";
import {
  SimpleGrid,
  Container,
  Title,
  Paper,
  Skeleton,
  Flex,
  Button,
} from "@mantine/core";
import { PostCard } from "../Posts/PostCard";
import styles from "./styles.module.scss";
import { useApiInfiniteQuery } from "@/services/hooks";
import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import type { PostData } from "@/types";

interface SavedPostsProps {}

export const SavedPosts: FC<SavedPostsProps> = () => {
  const limit = 2;
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useApiInfiniteQuery<PostData>({
      url: ENDPOINTS.SAVED_POSTS,
      queryKey: [RQ_KEYS.POSTS],
      initialPageParam: null,
      params: {
        limit,
      },
    });

  const posts = data?.pages?.flatMap((page) => page.data) ?? [];

  return (
    <Container size="lg" className={styles.container}>
      <Title order={2} className={styles.sectionTitle}>
        Saved posts
      </Title>
      <Paper p="md">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {posts?.map((post) => (
            <PostCard key={post.postId} {...post} />
          ))}
          {isFetchingNextPage &&
            Array.from({ length: limit }).map((_, i) => (
              <Skeleton key={i} height={322} radius="md" />
            ))}
        </SimpleGrid>

        {hasNextPage && (
          <Flex justify="center">
            <Button variant="outline" mt="md" onClick={() => fetchNextPage()}>
              Load more
            </Button>
          </Flex>
        )}
      </Paper>
    </Container>
  );
};

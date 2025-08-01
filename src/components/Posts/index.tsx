import type { FC } from "react";
import {
  SimpleGrid,
  Container,
  Skeleton,
  Button,
  Flex,
  Box,
} from "@mantine/core";
import { PostCard } from "./PostCard";
import { useApiInfiniteQuery } from "@/services/hooks";
import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import type { PostData } from "@/types";

interface PostsProps {}

export const Posts: FC<PostsProps> = () => {
  const limit = 2;
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useApiInfiniteQuery<PostData>({
      url: ENDPOINTS.POSTS,
      queryKey: [RQ_KEYS.POSTS],
      initialPageParam: null,
      params: {
        limit,
      },
    });

  const posts = data?.pages?.flatMap((page) => page.data) ?? [];

  return (
    <Container size="lg" p="0">
      <Box>
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
      </Box>
    </Container>
  );
};

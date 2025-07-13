import type { FC } from "react";
import { SimpleGrid, Container, Paper, Skeleton } from "@mantine/core";
import { PostCard } from "./PostCard";
import styles from "./styles.module.scss";
import { useApiQuery } from "@/services/hooks";
import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import type { PostData } from "@/types";

interface PostsProps {
  title?: string;
}

export const Posts: FC<PostsProps> = ({ title = "Latest Posts" }) => {
  const { data, isLoading } = useApiQuery<PostData[]>({
    url: ENDPOINTS.POSTS,
    queryKey: [RQ_KEYS.POSTS],
  });

  return (
    <Container size="lg" className={styles.container}>
      <Paper p="md">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {isLoading
            ? [1, 2, 3].map((i) => (
                <Skeleton key={i} height={322} radius="md" />
              ))
            : data?.map((post) => <PostCard key={post.postId} {...post} />)}
        </SimpleGrid>
      </Paper>
    </Container>
  );
};

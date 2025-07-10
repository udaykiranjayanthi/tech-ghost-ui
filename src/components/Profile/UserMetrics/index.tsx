import type { UserDetailsData } from "@/types";
import {
  Card,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import { type FC } from "react";
import styles from "./styles.module.scss";

interface UserMetricsProps {
  userDetails: UserDetailsData | undefined;
  isLoading: boolean;
}

export interface UserAnalytics {
  totalPosts: number;
  totalLikes: number;
  totalDislikes: number;
  totalComments: number;
  totalSaves: number;
}

const UserMetrics: FC<UserMetricsProps> = ({ userDetails, isLoading }) => {
  const statCards = [
    {
      title: "Followers",
      value: userDetails?.followersCount || 0,
    },
    {
      title: "Following",
      value: userDetails?.followingCount || 0,
    },
    {
      title: "Posts",
      value: userDetails?.postsCount || 0,
    },
  ];

  return (
    <Paper p="lg" className={styles.analyticsCard} withBorder>
      <Title order={3} mb="md">
        User Activity
      </Title>

      <SimpleGrid cols={{ base: 3 }}>
        {statCards.map((stat) => (
          <>
            {isLoading ? (
              <Skeleton height={87} width="100%" />
            ) : (
              <Card
                p="md"
                className={styles.statCard}
                withBorder
                key={stat.title}
              >
                <Group justify="center">
                  <Text size="xl" fw={700} ta="center">
                    {stat.value}
                  </Text>
                </Group>
                <Text size="sm" c="dimmed" ta="center">
                  {stat.title}
                </Text>
              </Card>
            )}
          </>
        ))}
      </SimpleGrid>
    </Paper>
  );
};

export default UserMetrics;

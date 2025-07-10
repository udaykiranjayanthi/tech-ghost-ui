import { RQ_KEYS } from "@/common/rqkeys";
import ENDPOINTS from "@/common/endpoints";
import { useApiQuery } from "@/services/hooks";
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

interface UserActivityProps {
  userId: string | undefined;
}

export interface UserAnalytics {
  totalPosts: number;
  totalLikes: number;
  totalDislikes: number;
  totalComments: number;
  totalSaves: number;
}

const UserActivity: FC<UserActivityProps> = ({ userId }) => {
  // Fetch user analytics
  const { data: userAnalytics, isLoading: isLoadingAnalytics } =
    useApiQuery<UserAnalytics>({
      url: `${ENDPOINTS.CURRENT_USER}/analytics`,
      queryKey: [RQ_KEYS.USER_ANALYTICS, userId || ""],
      options: {
        enabled: !!userId,
      },
    });

  // Placeholder data for analytics if API doesn't return it yet
  const analytics = userAnalytics || {
    totalPosts: 0,
    totalLikes: 0,
    totalDislikes: 0,
    totalComments: 0,
    totalSaves: 0,
  };

  const statCards = [
    {
      title: "Posts",
      value: analytics.totalPosts,
    },
    {
      title: "Likes Received",
      value: analytics.totalLikes,
    },
    {
      title: "Comments",
      value: analytics.totalComments,
    },
    {
      title: "Saves",
      value: analytics.totalSaves,
    },
    {
      title: "Dislikes",
      value: analytics.totalDislikes,
    },
  ];

  return (
    <Paper p="lg" className={styles.analyticsCard} withBorder>
      <Title order={3} mb="md">
        User Activity
      </Title>

      <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }}>
        {statCards.map((stat) => (
          <>
            {isLoadingAnalytics ? (
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

export default UserActivity;

import type { UserDetailsData } from "@/types";
import { Card, Group, SimpleGrid, Skeleton, Text } from "@mantine/core";
import { type FC, useState } from "react";
import styles from "./styles.module.scss";
import ConnectionsModal, { type ConnectionType } from "../ConnectionsModal";

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
  const [modalType, setModalType] = useState<ConnectionType>(null);

  const statCards = [
    {
      title: "Followers",
      value: userDetails?.followersCount || 0,
      onClick: () => setModalType("followers"),
    },
    {
      title: "Following",
      value: userDetails?.followingCount || 0,
      onClick: () => setModalType("following"),
    },
    {
      title: "Posts",
      value: userDetails?.postsCount || 0,
      onClick: () => "",
    },
  ];

  return (
    <Card p="lg" mt="md">
      <SimpleGrid cols={{ base: 3 }}>
        {statCards.map((stat) => (
          <div key={stat.title}>
            {isLoading ? (
              <Skeleton height={87} width="100%" />
            ) : (
              <Card
                p="md"
                className={styles.statCard}
                withBorder
                onClick={stat.onClick}
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
          </div>
        ))}
      </SimpleGrid>

      {userDetails && (
        <ConnectionsModal
          opened={modalType !== null}
          onClose={() => setModalType(null)}
          userId={userDetails.userId}
          type={modalType}
        />
      )}
    </Card>
  );
};

export default UserMetrics;

import type { UserData } from "@/types";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { PencilIcon } from "@phosphor-icons/react";
import { useState, type FC } from "react";
import styles from "./styles.module.scss";
import EditProfileModal from "../EditProfileModal";
import FollowButton from "../FollowButton";

interface UserInfoProps {
  userData: Partial<UserData>;
  isCurrentUser: boolean;
}

const UserInfo: FC<UserInfoProps> = ({ userData, isCurrentUser }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(userData.isFollowing || false);

  const handleFollowStatusChange = (newFollowingStatus: boolean) => {
    setIsFollowing(newFollowingStatus);
  };

  return (
    <Paper p="lg" className={styles.profileCard} withBorder>
      <Title order={3} mb="md" className={styles.sectionTitle}>
        Profile Information
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Box className={styles.avatarSection}>
            <Avatar
              src={userData.pictureUrl}
              size={120}
              radius={120}
              className={styles.avatar}
            />
            {isCurrentUser ? (
              <Button
                variant="light"
                leftSection={<PencilIcon size={16} />}
                onClick={() => setIsEditModalOpen(true)}
                className={styles.editButton}
              >
                Edit Profile
              </Button>
            ) : (
              <FollowButton
                userId={userData.userId || ""}
                isFollowing={isFollowing}
                onFollowStatusChange={handleFollowStatusChange}
              />
            )}
          </Box>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            <div>
              <Text size="sm" fw={500} c="dimmed">
                Name
              </Text>
              <Text size="lg" fw={700}>
                {userData.firstName} {userData.lastName}
              </Text>
            </div>

            {userData.headline && (
              <div>
                <Text size="sm" fw={500} c="dimmed">
                  Headline
                </Text>
                <Text size="lg">{userData.headline}</Text>
              </div>
            )}

            {userData.location && (
              <div>
                <Text size="sm" fw={500} c="dimmed">
                  Location
                </Text>
                <Text size="lg">{userData.location}</Text>
              </div>
            )}

            <div>
              <Text size="sm" fw={500} c="dimmed">
                Username
              </Text>
              <Text size="lg">@{userData.username}</Text>
            </div>

            {isCurrentUser && userData.email && (
              <div>
                <Text size="sm" fw={500} c="dimmed">
                  Email
                </Text>
                <Text size="lg">{userData.email}</Text>
              </div>
            )}

            {userData.bio && (
              <div>
                <Text size="sm" fw={500} c="dimmed">
                  Bio
                </Text>
                <Text size="md">{userData.bio}</Text>
              </div>
            )}
          </Stack>
        </Grid.Col>
      </Grid>

      {isCurrentUser && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userData={userData}
        />
      )}
    </Paper>
  );
};

export default UserInfo;

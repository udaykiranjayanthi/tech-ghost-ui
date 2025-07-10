import type { UserDetailsData } from "@/types";
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
  userDetails: UserDetailsData | undefined;
  isCurrentUser: boolean;
}

const UserInfo: FC<UserInfoProps> = ({ userDetails, isCurrentUser }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    userId,
    email,
    firstName,
    lastName,
    username,
    headline,
    location,
    bio,
    pictureUrl,
    following = false,
  } = userDetails || {};

  return (
    <Paper p="lg" className={styles.profileCard} withBorder>
      <Title order={3} mb="md" className={styles.sectionTitle}>
        Profile Information
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Box className={styles.avatarSection}>
            <Avatar
              src={pictureUrl}
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
              <FollowButton userId={userId || ""} following={following} />
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
                {firstName} {lastName}
              </Text>
            </div>

            {headline && (
              <div>
                <Text size="sm" fw={500} c="dimmed">
                  Headline
                </Text>
                <Text size="lg">{headline}</Text>
              </div>
            )}

            {location && (
              <div>
                <Text size="sm" fw={500} c="dimmed">
                  Location
                </Text>
                <Text size="lg">{location}</Text>
              </div>
            )}

            <div>
              <Text size="sm" fw={500} c="dimmed">
                Username
              </Text>
              <Text size="lg">@{username}</Text>
            </div>

            {isCurrentUser && email && (
              <div>
                <Text size="sm" fw={500} c="dimmed">
                  Email
                </Text>
                <Text size="lg">{email}</Text>
              </div>
            )}

            {bio && (
              <div>
                <Text size="sm" fw={500} c="dimmed">
                  Bio
                </Text>
                <Text size="md">{bio}</Text>
              </div>
            )}
          </Stack>
        </Grid.Col>
      </Grid>

      {isCurrentUser && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userDetails={userDetails}
        />
      )}
    </Paper>
  );
};

export default UserInfo;

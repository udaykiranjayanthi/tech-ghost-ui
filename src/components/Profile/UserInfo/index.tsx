import type { UserDetailsData } from "@/types";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Stack,
  Text,
  Title,
  Skeleton,
  Card,
  Group,
} from "@mantine/core";
import { PencilIcon, ChatCircleTextIcon } from "@phosphor-icons/react";
import { useState, type FC } from "react";
import { useNavigate } from "react-router";
import styles from "./styles.module.scss";
import EditProfileModal from "../EditProfileModal";
import FollowButton from "../FollowButton";

interface UserInfoProps {
  userDetails: UserDetailsData | undefined;
  isCurrentUser: boolean;
  isLoading: boolean;
}

const UserInfo: FC<UserInfoProps> = ({
  userDetails,
  isCurrentUser,
  isLoading,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

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
    <Card p="lg">
      <Title order={3} mb="md" className={styles.sectionTitle}>
        Profile Information
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Box className={styles.avatarSection}>
            {isLoading ? (
              <>
                <Skeleton height={120} circle />
                <Skeleton height={36} width={120} />
              </>
            ) : (
              <>
                <Avatar
                  src={pictureUrl}
                  size={120}
                  radius={120}
                  className={styles.avatar}
                  name={firstName + " " + lastName}
                  color="initials"
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
                  <Box>
                    <Group gap="sm" justify="center">
                      <FollowButton
                        userId={userId || ""}
                        following={following}
                      />
                      <Button
                        variant="light"
                        leftSection={<ChatCircleTextIcon size={20} />}
                        onClick={() => navigate(`/messages/${userId}`)}
                      >
                        Message
                      </Button>
                    </Group>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div>
                    <Skeleton key={i} height={17} width="160" mb="xs" />
                    <Skeleton key={i} height={22} width="280" />
                  </div>
                ))}

                {/* Bio skeleton */}
                <div>
                  <Skeleton height={17} width={40} mb="xs" />
                  <Skeleton height={80} width="100%" />
                </div>
              </>
            ) : (
              <>
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
              </>
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
    </Card>
  );
};

export default UserInfo;

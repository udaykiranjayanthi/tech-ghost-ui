import ENDPOINTS from "@/common/endpoints";
import { useApiMutation } from "@/services/hooks";
import { useGlobalStore } from "@/store";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { PencilIcon, CheckIcon, XIcon } from "@phosphor-icons/react";
import { useState, type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./styles.module.scss";

interface UserInfoProps {
  userId?: string;
  username?: string;
  email?: string;
  pictureUrl?: string;
  firstName?: string;
  lastName?: string;
}

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  username: string;
};

const UserInfo: FC<UserInfoProps> = ({
  username,
  email,
  pictureUrl,
  firstName,
  lastName,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Update user profile
  const { mutate: updateProfile, isPending: isUpdating } = useApiMutation({
    url: ENDPOINTS.CURRENT_USER,
    method: "put",
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: firstName || "",
      lastName: lastName || "",
      username: username || "",
    },
  });

  const handleEditToggle = () => {
    if (isEditing) {
      reset({
        firstName: firstName || "",
        lastName: lastName || "",
        username: username || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile(
      {
        payload: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          // Update global store with new user data
          useGlobalStore.setState((state) => ({
            userDetails: {
              ...state.userDetails!,
              firstName: data.firstName,
              lastName: data.lastName,
            },
          }));
        },
        onError: (error) => {
          console.error("Error updating profile:", error);
        },
      }
    );
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
              src={pictureUrl}
              size={120}
              radius={120}
              className={styles.avatar}
            />
            {!isEditing && (
              <Button
                variant="light"
                leftSection={<PencilIcon size={16} />}
                onClick={handleEditToggle}
                className={styles.editButton}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="md">
                <Group gap="md" justify="stretch">
                  <Controller
                    control={control}
                    name="firstName"
                    rules={{ required: "First name is required" }}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        label="First Name"
                        flex={1}
                        error={errors.firstName?.message}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="lastName"
                    rules={{ required: "Last name is required" }}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        label="Last Name"
                        flex={1}
                        error={errors.lastName?.message}
                      />
                    )}
                  />
                </Group>

                <Controller
                  control={control}
                  name="username"
                  rules={{ required: "Username is required" }}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label="Username"
                      error={errors.username?.message}
                    />
                  )}
                />

                <Group justify="flex-end" mt="md">
                  <Button
                    variant="outline"
                    color="gray"
                    onClick={handleEditToggle}
                    leftSection={<XIcon size={16} />}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={isUpdating}
                    leftSection={<CheckIcon size={16} />}
                  >
                    Save Changes
                  </Button>
                </Group>
              </Stack>
            </form>
          ) : (
            <Stack gap="md">
              <div>
                <Text size="sm" fw={500} c="dimmed">
                  Name
                </Text>
                <Text size="lg" fw={700}>
                  {firstName} {lastName}
                </Text>
              </div>

              <div>
                <Text size="sm" fw={500} c="dimmed">
                  Username
                </Text>
                <Text size="lg">{username}</Text>
              </div>

              <div>
                <Text size="sm" fw={500} c="dimmed">
                  Email
                </Text>
                <Text size="lg">{email}</Text>
              </div>
            </Stack>
          )}
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default UserInfo;

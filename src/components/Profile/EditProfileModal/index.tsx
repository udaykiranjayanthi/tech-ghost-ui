import ENDPOINTS from "@/common/endpoints";
import { useApiMutation } from "@/services/hooks";
import { useGlobalStore } from "@/store";
import {
  Button,
  Group,
  Modal,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect, type FC } from "react";
import type { UserData } from "@/types";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: Partial<UserData>;
}

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  username: string;
  headline: string;
  location: string;
  bio: string;
};

const EditProfileModal: FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  userData,
}) => {
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
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      username: userData.username || "",
      headline: userData.headline || "",
      location: userData.location || "",
      bio: userData.bio || "",
    },
  });

  useEffect(() => {
    if (!isOpen && userData) {
      reset({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        username: userData.username || "",
        headline: userData.headline || "",
        location: userData.location || "",
        bio: userData.bio || "",
      });
    }
  }, [isOpen, userData]);

  const handleCancel = () => {
    reset({
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      username: userData.username || "",
      headline: userData.headline || "",
      location: userData.location || "",
      bio: userData.bio || "",
    });
    onClose();
  };

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile(
      {
        payload: {
          firstName: data.firstName,
          lastName: data.lastName,
          headline: data.headline,
          location: data.location,
          bio: data.bio,
        },
      },
      {
        onSuccess: () => {
          // Update global store with new user data
          useGlobalStore.setState((state) => ({
            userDetails: {
              ...state.userDetails!,
              firstName: data.firstName,
              lastName: data.lastName,
              headline: data.headline,
              location: data.location,
              bio: data.bio,
            },
          }));
          onClose();
        },
        onError: (error) => {
          console.error("Error updating profile:", error);
        },
      }
    );
  };

  return (
    <Modal
      opened={isOpen}
      onClose={handleCancel}
      title="Edit Profile"
      size="lg"
      centered
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <Group gap="md" grow>
            <Controller
              control={control}
              name="firstName"
              rules={{ required: "First name is required" }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="First Name"
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
                disabled
              />
            )}
          />

          <Controller
            control={control}
            name="headline"
            render={({ field }) => (
              <TextInput
                {...field}
                label="Headline"
                placeholder="Software Engineer, Designer, etc."
              />
            )}
          />

          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <TextInput
                {...field}
                label="Location"
                placeholder="City, Country"
              />
            )}
          />

          <Controller
            control={control}
            name="bio"
            render={({ field }) => (
              <Textarea
                {...field}
                label="Bio"
                placeholder="Tell us about yourself"
                minRows={3}
              />
            )}
          />

          <Group justify="flex-end" mt="md">
            <Button
              variant="outline"
              color="gray"
              onClick={handleCancel}
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
    </Modal>
  );
};

export default EditProfileModal;

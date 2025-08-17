import ENDPOINTS from "@/common/endpoints";
import { useApiMutation } from "@/services/hooks";
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
import { useQueryClient } from "@tanstack/react-query";
import { RQ_KEYS } from "@/common/rqkeys";
import type { UserDetailsData } from "@/types";
import { handleError } from "@/services/utils";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDetails?: UserDetailsData;
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
  userDetails,
}) => {
  // Update user profile
  const { mutate: updateProfile, isPending: isUpdating } = useApiMutation({
    url: `${ENDPOINTS.USERS}/${userDetails?.userId}`,
    method: "put",
  });

  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      headline: "",
      location: "",
      bio: "",
    },
  });

  // validationRules.ts
  const validationRules = {
    firstName: {
      required: "First name is required",
      maxLength: {
        value: 50,
        message: "First name must not exceed 50 characters",
      },
    },
    lastName: {
      required: "Last name is required",
      maxLength: {
        value: 50,
        message: "Last name must not exceed 50 characters",
      },
    },
    headline: {
      maxLength: {
        value: 100,
        message: "Headline must not exceed 100 characters",
      },
    },
    bio: {
      maxLength: { value: 500, message: "Bio must not exceed 500 characters" },
    },
    location: {
      maxLength: {
        value: 100,
        message: "Location must not exceed 100 characters",
      },
    },
  };

  useEffect(() => {
    if (!isOpen && userDetails) {
      reset({
        firstName: userDetails.firstName || "",
        lastName: userDetails.lastName || "",
        username: userDetails.username || "",
        headline: userDetails.headline || "",
        location: userDetails.location || "",
        bio: userDetails.bio || "",
      });
    }
  }, [isOpen, userDetails]);

  const handleCancel = () => {
    reset();
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
          queryClient.invalidateQueries({
            queryKey: [RQ_KEYS.USER_DETAILS, userDetails?.username],
          });

          onClose();
        },
        onError: (error) => {
          handleError({ error });
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
              rules={validationRules.firstName}
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
              rules={validationRules.lastName}
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
            rules={validationRules.headline}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Headline"
                placeholder="Software Engineer, Designer, etc."
                error={errors.headline?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="location"
            rules={validationRules.location}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Location"
                placeholder="City, Country"
                error={errors.location?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="bio"
            rules={validationRules.bio}
            render={({ field }) => (
              <Textarea
                {...field}
                label="Bio"
                placeholder="Tell us about yourself"
                minRows={3}
                error={errors.bio?.message}
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

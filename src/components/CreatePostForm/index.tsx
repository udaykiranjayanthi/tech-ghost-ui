import type { FC } from "react";
import {
  TextInput,
  Textarea,
  Button,
  Title,
  Group,
  Container,
  Text,
  Box,
  Divider,
  Switch,
  Pill,
  Autocomplete,
} from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeftIcon, ImageIcon } from "@phosphor-icons/react";
import styles from "./styles.module.scss";
import { useApiMutation, useApiQuery } from "@/services/hooks";
import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import type { PostDetailsData } from "@/types";
import { handleError } from "@/services/utils";
import { notifications } from "@mantine/notifications";
import { WarningCircleIcon } from "@phosphor-icons/react";

interface CreatePostFormProps {}

interface PostFormValues {
  title: string;
  thumbnailUrl: string;
  tldr: string;
  content: string;
  externalUrl: string;
  includeExternalLink: boolean;
  hashtags: string[];
}

export const CreatePostForm: FC<CreatePostFormProps> = () => {
  const navigate = useNavigate();
  const [currentHashtag, setCurrentHashtag] = useState("");
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const { postId = "" } = useParams<{ postId: string }>();
  const isCreate = !postId;

  const { mutate: createPost, isPending: isCreatePending } = useApiMutation({
    url: ENDPOINTS.POSTS,
    method: "post",
  });

  const { mutate: updatePost, isPending: isUpdatePending } = useApiMutation({
    url: `${ENDPOINTS.POSTS}/${postId}`,
    method: "put",
  });

  const { data: postDetails } = useApiQuery<PostDetailsData>({
    url: `${ENDPOINTS.POSTS}/${postId}`,
    queryKey: [RQ_KEYS.POST_DETAILS, postId],
    options: {
      enabled: !isCreate,
    },
  });

  // Sample hashtag suggestions
  const hashtagSuggestions = [
    { value: "javascript", label: "JavaScript" },
    { value: "react", label: "React" },
    { value: "typescript", label: "TypeScript" },
    { value: "nodejs", label: "Node.js" },
    { value: "webdev", label: "WebDev" },
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "programming", label: "Programming" },
    { value: "coding", label: "Coding" },
    { value: "devops", label: "DevOps" },
    { value: "cloud", label: "Cloud" },
    { value: "aws", label: "AWS" },
    { value: "docker", label: "Docker" },
    { value: "kubernetes", label: "Kubernetes" },
  ];

  const {
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<PostFormValues>({
    defaultValues: {
      title: "",
      thumbnailUrl: "",
      tldr: "",
      content: "",
      includeExternalLink: true,
      externalUrl: "",
    },
  });

  useEffect(() => {
    if (postDetails) {
      reset({
        title: postDetails.title,
        thumbnailUrl: postDetails.thumbnailUrl,
        tldr: postDetails.tldr,
        content: postDetails.content,
        externalUrl: postDetails.externalUrl,
        includeExternalLink: postDetails.includeExternalLink,
      });
      setSelectedHashtags(postDetails.hashtags);
    }
  }, [postDetails]);

  const rules = {
    title: {
      required: "Title is required",
      maxLength: {
        value: 200,
        message: "Title must not exceed 200 characters",
      },
    },
    thumbnailUrl: {
      required: "Thumbnail URL is required",
      maxLength: {
        value: 500,
        message: "Thumbnail URL must not exceed 500 characters",
      },
      pattern: {
        value: /^(https?:\/\/).+/,
        message:
          "Thumbnail URL must be a valid URL starting with http or https",
      },
    },
    tldr: {
      required: "TLDR is required",
      maxLength: {
        value: 300,
        message: "TL;DR must not exceed 300 characters",
      },
    },
    content: {
      required: "Content is required",
      maxLength: {
        value: 10000,
        message: "Content must not exceed 10,000 characters",
      },
    },
    externalUrl: {
      required: "External URL is required",
      maxLength: {
        value: 500,
        message: "External URL must not exceed 500 characters",
      },
      pattern: {
        value: /^(https?:\/\/).+/,
        message: "External URL must be a valid URL starting with http or https",
      },
    },
  };

  // Watch the includeExternalLink field to conditionally render the external URL input
  const includeExternalLink = watch("includeExternalLink");

  const handleAddHashtag = (tag: string) => {
    // Validate hashtag format (alphanumeric/underscore and max 30 characters)
    const newTag = tag
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");

    // Check if hashtag is valid
    if (!newTag) {
      return;
    }

    // Check if hashtag is already added
    if (selectedHashtags.includes(newTag)) {
      notifications.show({
        position: "top-center",
        withCloseButton: true,
        autoClose: 3000,
        title: "Duplicate Hashtag",
        message: `Hashtag #${newTag} is already added`,
        color: "yellow",
        icon: <WarningCircleIcon size={24} />,
      });
      return;
    }

    // Validate hashtag length
    if (newTag.length > 30) {
      notifications.show({
        position: "top-center",
        withCloseButton: true,
        autoClose: 3000,
        title: "Validation Error",
        message: "Hashtags must not exceed 30 characters",
        color: "red",
        icon: <WarningCircleIcon size={24} />,
      });
      return;
    }

    // Validate maximum number of hashtags (10)
    if (selectedHashtags.length >= 10) {
      notifications.show({
        position: "top-center",
        withCloseButton: true,
        autoClose: 3000,
        title: "Maximum Hashtags Reached",
        message: "You can add a maximum of 10 hashtags",
        color: "red",
        icon: <WarningCircleIcon size={24} />,
      });
      return;
    }

    // Add the hashtag
    setSelectedHashtags([...selectedHashtags, newTag]);
  };

  useEffect(() => {
    setCurrentHashtag("");
  }, [selectedHashtags]);

  const handleRemoveHashtag = (tag: string) => {
    setSelectedHashtags(selectedHashtags.filter((t) => t !== tag));
  };

  const onFormSubmit = async (data: PostFormValues) => {
    // Validate hashtags format before submitting
    const invalidHashtags = selectedHashtags.filter((tag) => {
      // Check if hashtag matches the pattern (alphanumeric/underscore and max 30 characters)
      return !tag.match(/^[a-zA-Z0-9_]{1,30}$/);
    });

    if (invalidHashtags.length > 0) {
      notifications.show({
        position: "top-center",
        withCloseButton: true,
        autoClose: 5000,
        title: "Invalid Hashtags",
        message: `Some hashtags have invalid format: ${invalidHashtags.join(
          ", "
        )}`,
        color: "red",
        icon: <WarningCircleIcon size={24} />,
      });
      return;
    }

    // Include hashtags in the form data
    const formData = {
      ...data,
      hashtags: selectedHashtags,
    };

    if (isCreate) {
      createPost(
        { payload: formData },
        {
          onSuccess: () => navigate("/"),
          onError: (error) => {
            handleError({ error });
          },
        }
      );
    } else {
      updatePost(
        { payload: formData },
        {
          onSuccess: () => navigate("/"),
          onError: (error) => {
            handleError({ error });
          },
        }
      );
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <Container size="lg" p="0">
      <Box mb="md">
        <Button
          onClick={handleBackClick}
          variant="light"
          size="sm"
          className={styles.backButton}
        >
          <Group gap="xs">
            <ArrowLeftIcon size={24} />
            <Text>Go back</Text>
          </Group>
        </Button>
      </Box>

      <Box>
        <Title order={2} className={styles.formTitle}>
          {isCreate ? "Create New Post" : "Edit Post"}
        </Title>

        <div className={styles.form}>
          <Controller
            control={control}
            name="title"
            rules={rules.title}
            render={({ field }) => (
              <TextInput
                label="Title"
                placeholder="Enter a descriptive title"
                required
                {...field}
                className={styles.formField}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            rules={rules.thumbnailUrl}
            name="thumbnailUrl"
            render={({ field }) => (
              <TextInput
                label="Thumbnail URL"
                placeholder="Enter the URL of the thumbnail image"
                required
                {...field}
                className={styles.formField}
                rightSection={<ImageIcon size={20} opacity={0.5} />}
                error={errors.thumbnailUrl?.message}
              />
            )}
          />

          <Controller
            control={control}
            rules={rules.tldr}
            name="tldr"
            render={({ field }) => (
              <Textarea
                label="TLDR (Too Long; Didn't Read)"
                placeholder="Enter a brief summary of your post"
                required
                rows={3}
                {...field}
                className={styles.formField}
                error={errors.tldr?.message}
              />
            )}
          />

          <Controller
            control={control}
            rules={rules.content}
            name="content"
            render={({ field }) => (
              <Textarea
                label="Content"
                placeholder="Enter the full content of your post"
                required
                rows={10}
                resize="vertical"
                {...field}
                className={styles.formField}
                error={errors.content?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="includeExternalLink"
            render={({ field }) => (
              <Switch
                label={`Include external link`}
                {...field}
                checked={field.value}
                value={field.value ? "1" : "0"}
                className={styles.formField}
              />
            )}
          />

          {includeExternalLink && (
            <Controller
              control={control}
              rules={includeExternalLink ? rules.externalUrl : {}}
              name="externalUrl"
              render={({ field }) => (
                <TextInput
                  label="External URL"
                  placeholder="Enter the URL of the external article"
                  required={includeExternalLink}
                  {...field}
                  className={styles.formField}
                  error={errors.externalUrl?.message}
                />
              )}
            />
          )}

          <Autocomplete
            label="Add Hashtags"
            placeholder="Type or select a hashtag"
            value={currentHashtag}
            onChange={setCurrentHashtag}
            data={hashtagSuggestions.map((item) => item.value)}
            className={styles.formField}
            onOptionSubmit={handleAddHashtag}
          />

          {selectedHashtags.length > 0 && (
            <Group gap="xs" className={styles.hashtagsPreview}>
              {selectedHashtags.map((tag) => (
                <Pill
                  key={tag}
                  withRemoveButton
                  className={styles.hashtag}
                  onRemove={() => {
                    handleRemoveHashtag(tag);
                  }}
                  size="md"
                >
                  #{tag}
                </Pill>
              ))}
            </Group>
          )}

          <Divider my="md" />

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={handleBackClick}>
              Cancel
            </Button>
            <Button
              loading={isCreatePending || isUpdatePending}
              onClick={handleSubmit(onFormSubmit)}
            >
              {isCreate ? "Create Post" : "Update Post"}
            </Button>
          </Group>
        </div>
      </Box>
    </Container>
  );
};

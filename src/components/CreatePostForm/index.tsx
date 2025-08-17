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
    },
    thumbnailUrl: {
      required: "Thumbnail URL is required",
    },
    tldr: {
      required: "TLDR is required",
    },
    content: {
      required: "Content is required",
    },
    externalUrl: {
      required: "External URL is required",
    },
  };

  // Watch the includeExternalLink field to conditionally render the external URL input
  const includeExternalLink = watch("includeExternalLink");

  const handleAddHashtag = (tag: string) => {
    const newTag = tag
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    if (newTag && !selectedHashtags.includes(newTag)) {
      setSelectedHashtags([...selectedHashtags, newTag]);
    }
  };

  useEffect(() => {
    setCurrentHashtag("");
  }, [selectedHashtags]);

  const handleRemoveHashtag = (tag: string) => {
    setSelectedHashtags(selectedHashtags.filter((t) => t !== tag));
  };

  const onFormSubmit = async (data: PostFormValues) => {
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
              rules={rules.externalUrl}
              name="externalUrl"
              render={({ field }) => (
                <TextInput
                  label="External URL"
                  placeholder="Enter the URL of the external article"
                  required
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

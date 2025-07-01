import type { FC } from "react";
import {
  TextInput,
  Textarea,
  Button,
  Paper,
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
import { useNavigate } from "react-router";
import { ArrowLeftIcon, ImageIcon } from "@phosphor-icons/react";
import styles from "./styles.module.scss";
import { useApiMutation } from "@/services/hooks";
import ENDPOINTS from "@/common/endpoints";

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
  const { mutate, isPending } = useApiMutation({
    url: ENDPOINTS.POSTS,
    method: "post",
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
  } = useForm<PostFormValues>({
    defaultValues: {
      title: "",
      thumbnailUrl: "",
      tldr: "",
      content: "",
      externalUrl: "",
      includeExternalLink: false,
      hashtags: [],
    },
  });

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

    mutate(formData, {
      onSuccess: () => navigate("/"),
      onError: () => console.log("Error creating post"),
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Container size="lg" className={styles.container}>
      <Box className={styles.backButtonContainer}>
        <Button
          onClick={handleCancel}
          variant="transparent"
          size="sm"
          className={styles.backButton}
        >
          <Group gap="xs">
            <ArrowLeftIcon size={24} />
            <Text>Go back</Text>
          </Group>
        </Button>
      </Box>

      <Paper p="md" className={styles.formContainer}>
        <Title order={2} className={styles.formTitle}>
          Create New Post
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
              />
            )}
          />

          <Controller
            control={control}
            name="includeExternalLink"
            render={({ field }) => (
              <Switch
                label="Include external link"
                {...field}
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
                >
                  #{tag}
                </Pill>
              ))}
            </Group>
          )}

          <Divider my="md" />

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button loading={isPending} onClick={handleSubmit(onFormSubmit)}>
              Create Post
            </Button>
          </Group>
        </div>
      </Paper>
    </Container>
  );
};

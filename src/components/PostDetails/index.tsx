import type { FC } from "react";
import {
  Image,
  Text,
  Group,
  ActionIcon,
  Flex,
  Container,
  Button,
  Title,
  Divider,
  Paper,
  Box,
} from "@mantine/core";
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  ChatCircleIcon,
  BookmarkSimpleIcon,
  LinkIcon,
  ArrowLeftIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router";
import { Comments } from "./Comments";
import styles from "./styles.module.scss";
import { useApiQuery } from "@/services/hooks";
import type { PostDetailsData } from "@/types";
import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import { displayDate } from "@/services/utils";

interface PostDetailsProps {}

// Sample post data
// TODO: remove
const dummyPost = {
  id: "1",
  title: "Getting Started with React 18: New Features and Improvements",
  thumbnailUrl:
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  tldr: "React 18 introduces concurrent rendering, automatic batching, transitions, and suspense on the server. These features aim to improve application performance and developer experience without requiring major code changes.",
  content:
    "React 18 has been released with several exciting new features and improvements. The most significant change is the introduction of concurrent rendering, which allows React to prepare multiple versions of the UI simultaneously. This means that React can work on several state updates at the same time without blocking the main thread, resulting in a more responsive user interface.\n\nAutomatic batching is another notable improvement. In previous versions, React would only batch updates inside React event handlers. With React 18, batching is automatic for all updates, leading to fewer renders and better performance.\n\nTransitions are a new concept in React 18 that allow you to mark some state updates as non-urgent. This is particularly useful for expensive rendering operations that might otherwise cause UI lag.\n\nSuspense on the server is now supported, enabling you to use the same component structure for both client and server rendering. This makes it easier to build applications that render on the server and hydrate on the client.",
  upvotes: 124,
  downvotes: 12,
  commentsCount: 32,
  date: "June 28, 2025",
  externalUrl: "https://reactjs.org",
  saved: false,
};

// Sample comments data
const dummyComments = [
  {
    id: "c1",
    author: "Jane Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    content:
      "This is a great overview of React 18! I'm particularly excited about the concurrent rendering feature.",
    date: "June 29, 2025",
    upvotes: 8,
    downvotes: 1,
  },
  {
    id: "c2",
    author: "John Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    content:
      "I've been using automatic batching in my projects and it's made a noticeable difference in performance.",
    date: "June 28, 2025",
    upvotes: 5,
    downvotes: 0,
  },
  {
    id: "c3",
    author: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=3",
    content:
      "Has anyone tried using Suspense on the server yet? I'm curious about real-world use cases.",
    date: "June 27, 2025",
    upvotes: 3,
    downvotes: 0,
  },
];

export const PostDetails: FC<PostDetailsProps> = () => {
  const navigate = useNavigate();
  const { postId = "" } = useParams<{ postId: string }>();

  const { data } = useApiQuery<PostDetailsData>({
    url: `${ENDPOINTS.POSTS}/${postId}`,
    queryKey: [RQ_KEYS.POST_DETAILS, postId],
  });

  // In a real app, you would fetch the post data based on postId
  // For example: const post = useFetchPost(postId);
  console.log(`Viewing post with ID: ${postId}`);
  const {
    title,
    thumbnailUrl,
    upvotes,
    downvotes,
    commentsCount,
    createdAt,
    externalUrl,
    saved,
    tldr,
    content,
  } = data || {};

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleUpvote = () => {
    // Add upvote functionality here
  };

  const handleDownvote = () => {
    // Add downvote functionality here
  };

  const handleSaveClick = () => {
    // Add save functionality here
  };

  const handleCopyLinkClick = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  const handleReadPostClick = () => {
    if (externalUrl) {
      window.open(externalUrl, "_blank");
    }
  };

  return (
    <Container size="lg" className={styles.container}>
      <Box className={styles.backButtonContainer}>
        <Group gap="xs" justify="space-between">
          <Button
            onClick={handleBackClick}
            variant="transparent"
            size="sm"
            className={styles.backButton}
          >
            <Group gap="xs">
              <ArrowLeftIcon size={24} />
              <Text>Go back</Text>
            </Group>
          </Button>
          {externalUrl && (
            <Button
              variant="light"
              size="sm"
              mr="md"
              rightSection={<ArrowSquareOutIcon size={16} />}
              onClick={handleReadPostClick}
            >
              Read Post
            </Button>
          )}
        </Group>
      </Box>

      <Paper p="md" className={styles.postCard}>
        <Title order={1} className={styles.title}>
          {title}
        </Title>

        <Text size="sm" c="dimmed" className={styles.date}>
          {displayDate(createdAt)}
        </Text>

        <Image src={thumbnailUrl} height={300} alt={title} radius="sm" />

        <Paper p="md" className={styles.tldrSection} withBorder>
          <Title order={4}>TLDR;</Title>
          <Text className={styles.tldr}>{tldr}</Text>
        </Paper>

        <Text className={styles.content}>{content}</Text>

        <Divider my="lg" />

        <Group className={styles.actionBar} justify="space-between">
          <Flex gap="md" align="center">
            <Group gap="8" className={styles.likesGroup}>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="md"
                onClick={handleUpvote}
              >
                <ThumbsUpIcon size={20} />
              </ActionIcon>
              <Text size="sm" c="dimmed">
                {upvotes && downvotes ? upvotes - downvotes : 0}
              </Text>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="md"
                onClick={handleDownvote}
              >
                <ThumbsDownIcon size={20} />
              </ActionIcon>
            </Group>

            <Group gap="8">
              <ActionIcon variant="subtle" color="gray" size="md">
                <ChatCircleIcon size={20} />
              </ActionIcon>
              <Text size="sm" c="dimmed">
                {commentsCount}
              </Text>
            </Group>
          </Flex>

          <Group gap="sm">
            <ActionIcon
              variant="subtle"
              color={saved ? "blue" : "gray"}
              size="md"
              onClick={handleSaveClick}
            >
              <BookmarkSimpleIcon
                size={20}
                weight={saved ? "fill" : "regular"}
              />
            </ActionIcon>

            <ActionIcon
              variant="subtle"
              color="gray"
              size="md"
              onClick={handleCopyLinkClick}
            >
              <LinkIcon size={20} />
            </ActionIcon>

            {externalUrl && (
              <Button
                variant="light"
                size="sm"
                rightSection={<ArrowSquareOutIcon size={16} />}
                onClick={handleReadPostClick}
              >
                Read Post
              </Button>
            )}
          </Group>
        </Group>
      </Paper>

      <Comments comments={dummyComments} postId={postId ?? ""} />
    </Container>
  );
};

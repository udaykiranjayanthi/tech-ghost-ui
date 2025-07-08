import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import { useApiQuery } from "@/services/hooks";
import { displayDate } from "@/services/utils";
import type { PostDetailsData } from "@/types";
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Image,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import {
  ArrowLeftIcon,
  ArrowSquareOutIcon,
  BookmarkSimpleIcon,
  ChatCircleIcon,
  LinkIcon,
} from "@phosphor-icons/react";
import { type FC } from "react";
import { useNavigate, useParams } from "react-router";
import LikeDislike from "../LikeDislike";
import { Comments } from "./Comments";
import styles from "./styles.module.scss";

interface PostDetailsProps {}

export const PostDetails: FC<PostDetailsProps> = () => {
  const navigate = useNavigate();
  const { postId = "" } = useParams<{ postId: string }>();

  const { data } = useApiQuery<PostDetailsData>({
    url: `${ENDPOINTS.POSTS}/${postId}`,
    queryKey: [RQ_KEYS.POST_DETAILS, postId],
  });

  // In a real app, you would fetch the post data based on postId
  // For example: const post = useFetchPost(postId);
  const {
    title,
    thumbnailUrl,
    likes = 0,
    dislikes = 0,
    userReaction = null,
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
            <LikeDislike
              likes={likes}
              dislikes={dislikes}
              userReaction={userReaction}
              postId={postId}
            />

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

      <Comments postId={postId ?? ""} />
    </Container>
  );
};

import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import { useApiQuery } from "@/services/hooks";
import { displayDate } from "@/services/utils";
import type { PostDetailsData } from "@/types";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Image,
  Paper,
  Pill,
  Text,
  Title,
} from "@mantine/core";
import {
  ArrowLeftIcon,
  ArrowSquareOutIcon,
  PencilIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, type FC } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router";
import PostLikeDislike from "../PostLikeDislike";
import PostSave from "../PostSave";
import { Comments } from "./Comments";
import styles from "./styles.module.scss";
import CopyLinkButton from "../CopyLinkButton";
import { useGlobalStore } from "@/store";

interface PostDetailsProps {}

export const PostDetails: FC<PostDetailsProps> = () => {
  const navigate = useNavigate();
  const { postId = "" } = useParams<{ postId: string }>();
  const { userId } = useGlobalStore.use.userDetails?.() ?? {};

  const { data } = useApiQuery<PostDetailsData>({
    url: `${ENDPOINTS.POSTS}/${postId}`,
    queryKey: [RQ_KEYS.POST_DETAILS, postId],
  });

  const location = useLocation();
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.hash === "#comments" && commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  const {
    title,
    thumbnailUrl,
    likes = 0,
    dislikes = 0,
    userReaction = null,
    createdAt,
    externalUrl,
    saved,
    tldr,
    content,
    hashtags,
    author,
  } = data || {};

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleReadPostClick = () => {
    if (externalUrl) {
      window.open(externalUrl, "_blank");
    }
  };

  const isAuthor = userId === author?.userId;

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
          <Group gap="sm">
            {isAuthor && (
              <Button
                variant="outline"
                size="sm"
                rightSection={<PencilIcon size={16} />}
                onClick={() => navigate(`/post/${postId}/edit`)}
              >
                Edit Post
              </Button>
            )}
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
        </Group>
      </Box>

      <Paper p="md" className={styles.postCard}>
        <Title order={1} className={styles.title}>
          {title}
        </Title>

        <Group gap="md" className={styles.authorInfo}>
          <Group gap="xs">
            <NavLink
              to={`/profile/${author?.username}`}
              className={styles.author}
            >
              <Avatar
                src={author?.pictureUrl}
                size="sm"
                name={author?.firstName + " " + author?.lastName}
                color="initials"
              />
              <Text fw={500}>
                {author?.firstName} {author?.lastName}
              </Text>
            </NavLink>
          </Group>
          ·
          <Text size="sm" c="dimmed">
            {displayDate(createdAt)}
          </Text>
        </Group>

        <Image src={thumbnailUrl} height={300} alt={title} radius="sm" />

        <Paper p="md" className={styles.tldrSection} withBorder>
          <Title order={4}>TLDR;</Title>
          <Text className={styles.tldr}>{tldr}</Text>
        </Paper>

        <Text className={styles.content}>{content}</Text>

        <Group gap="xs" className={styles.hashtagsPreview}>
          {hashtags?.map((hashtag) => (
            <Pill key={hashtag} className={styles.hashtag} size="md">
              #{hashtag}
            </Pill>
          ))}
        </Group>

        <Divider my="lg" />

        <Group className={styles.actionBar} justify="space-between">
          <Flex gap="md" align="center">
            <PostLikeDislike
              likes={likes}
              dislikes={dislikes}
              userReaction={userReaction}
              likeEndpoint={`${ENDPOINTS.POSTS}/${postId}/like`}
              dislikeEndpoint={`${ENDPOINTS.POSTS}/${postId}/dislike`}
            />
          </Flex>

          <Group gap="sm">
            <PostSave postId={postId} saved={saved} />

            <CopyLinkButton copyText={`http://localhost:3000/post/${postId}`} />

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

      <div ref={commentsRef}>
        <Comments postId={postId ?? ""} />
      </div>
    </Container>
  );
};

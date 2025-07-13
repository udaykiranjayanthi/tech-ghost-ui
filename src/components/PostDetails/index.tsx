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
  Skeleton,
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

  const { data, isLoading } = useApiQuery<PostDetailsData>({
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
    likesCount = 0,
    dislikesCount = 0,
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
            {isLoading ? (
              <Skeleton height={36} width={100} radius="md" />
            ) : (
              <>
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
              </>
            )}
          </Group>
        </Group>
      </Box>

      <Paper p="md" className={styles.postCard}>
        {isLoading ? (
          <>
            {/* Title skeleton */}
            <Skeleton height={40} width="80%" mb="md" />

            {/* Author info skeleton */}
            <Group gap="md" className={styles.authorInfo} mb="lg">
              <Group gap="xs">
                <Skeleton height={32} width={32} radius="xl" />
                <Skeleton height={20} width={120} />
              </Group>
              <Skeleton height={18} width={80} />
            </Group>

            {/* Image skeleton */}
            <Skeleton height={300} width="100%" radius="sm" mb="lg" />

            {/* TLDR skeleton */}
            <Paper p="md" className={styles.tldrSection} withBorder mb="lg">
              <Title order={4}>TLDR;</Title>
              <Skeleton height={20} mt="sm" />
              <Skeleton height={20} mt="sm" width="90%" />
            </Paper>

            {/* Content skeleton */}
            <Box mb="lg">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} height={20} mb="sm" />
              ))}
            </Box>

            {/* Hashtags skeleton */}
            <Group gap="xs" mb="lg">
              <Skeleton height={28} width={80} radius="xl" />
              <Skeleton height={28} width={100} radius="xl" />
              <Skeleton height={28} width={90} radius="xl" />
            </Group>

            <Divider my="lg" />

            {/* Action bar skeleton */}
            <Group className={styles.actionBar} justify="space-between">
              <Skeleton height={36} width={120} />
              <Group gap="sm">
                <Skeleton height={36} width={36} radius="md" />
                <Skeleton height={36} width={36} radius="md" />
                <Skeleton height={36} width={100} radius="md" />
              </Group>
            </Group>
          </>
        ) : (
          <>
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
                  likesCount={likesCount}
                  dislikesCount={dislikesCount}
                  userReaction={userReaction}
                  likeEndpoint={`${ENDPOINTS.POSTS}/${postId}/like`}
                  dislikeEndpoint={`${ENDPOINTS.POSTS}/${postId}/dislike`}
                />
              </Flex>

              <Group gap="sm">
                <PostSave postId={postId} saved={saved} />

                <CopyLinkButton
                  copyText={`http://localhost:3000/post/${postId}`}
                />

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
          </>
        )}
      </Paper>

      <div ref={commentsRef}>
        {isLoading ? (
          <Paper p="md" mt="md">
            <Skeleton height={30} width="50%" mb="lg" />
            <Skeleton height={80} mb="md" />
            <Skeleton height={80} mb="md" />
            <Skeleton height={80} />
          </Paper>
        ) : (
          <Comments postId={postId ?? ""} />
        )}
      </div>
    </Container>
  );
};

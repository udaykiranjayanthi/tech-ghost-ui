import type { FC } from "react";
import { SimpleGrid, Container, Title, Paper } from "@mantine/core";
import { PostCard } from "./PostCard";
import styles from "./styles.module.scss";

interface PostsProps {
  title?: string;
}

// Sample dummy data for blog posts
const dummyPosts = [
  {
    id: "1",
    title: "Getting Started with React 18: New Features and Improvements",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    upvotes: 124,
    downvotes: 12,
    commentsCount: 32,
    date: "June 28, 2025",
    externalUrl: "https://reactjs.org",
    saved: true,
  },
  {
    id: "2",
    title: "Building Scalable Applications with Next.js and TypeScript",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    upvotes: 98,
    downvotes: 5,
    commentsCount: 24,
    date: "June 27, 2025",
  },
  {
    id: "3",
    title: "CSS-in-JS vs CSS Modules: Which One Should You Choose?",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    upvotes: 76,
    downvotes: 18,
    commentsCount: 42,
    date: "June 26, 2025",
    externalUrl: "https://css-tricks.com",
  },
  {
    id: "4",
    title: "The Future of Web Development: What to Expect in 2026",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",
    upvotes: 145,
    downvotes: 8,
    commentsCount: 37,
    date: "June 25, 2025",
  },
  {
    id: "5",
    title: "Optimizing React Performance: Tips and Best Practices",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    upvotes: 112,
    downvotes: 4,
    commentsCount: 28,
    date: "June 24, 2025",
    saved: true,
  },
  {
    id: "6",
    title: "Introduction to GraphQL: A Modern API for Modern Web Apps",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    upvotes: 89,
    downvotes: 7,
    commentsCount: 19,
    date: "June 23, 2025",
    externalUrl: "https://graphql.org",
  },
];

export const Posts: FC<PostsProps> = ({ title = "Latest Posts" }) => {
  return (
    <Container size="lg" className={styles.container}>
      <Paper p="md">
        <Title order={2} className={styles.sectionTitle}>
          {title}
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {dummyPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </SimpleGrid>
      </Paper>
    </Container>
  );
};

import { useGlobalStore } from "@/store";
import { Container, Title } from "@mantine/core";
import { type FC } from "react";
import UserActivity from "./UserActivity";
import UserInfo from "./UserInfo";
import UserPosts from "./UserPosts";
import styles from "./styles.module.scss";
import type { UserData } from "@/types";

interface ProfileProps {}

const Profile: FC<ProfileProps> = () => {
  const userDetails = useGlobalStore.use.userDetails?.() ?? ({} as UserData);

  return (
    <Container size="lg" className={styles.container}>
      <Title order={1} className={styles.pageTitle}>
        My Profile
      </Title>

      <UserInfo
        userId={userDetails.userId}
        username={userDetails.username}
        email={userDetails.email}
        pictureUrl={userDetails.pictureUrl}
        firstName={userDetails.firstName}
        lastName={userDetails.lastName}
      />

      <UserActivity userId={userDetails.userId} />

      <UserPosts userId={userDetails.userId} />
    </Container>
  );
};

export default Profile;

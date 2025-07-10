import { useGlobalStore } from "@/store";
import { Container, Title, Loader, Center } from "@mantine/core";
import { type FC } from "react";
import UserActivity from "./UserActivity";
import UserInfo from "./UserInfo";
import UserPosts from "./UserPosts";
import styles from "./styles.module.scss";
import type { UserData } from "@/types";
import { useParams } from "react-router";
import { useApiQuery } from "@/services/hooks";
import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";

interface ProfileProps {}

const Profile: FC<ProfileProps> = () => {
  const { username = "" } = useParams<{ username?: string }>();
  const currentUserDetails =
    useGlobalStore.use.userDetails?.() ?? ({} as UserData);

  // If no username is provided in the URL, show the current user's profile
  const isCurrentUser = username === currentUserDetails.username;

  // If it's not the current user, fetch the user data
  const { data: userData, isLoading } = useApiQuery<UserData>({
    queryKey: [RQ_KEYS.USER_DETAILS, username],
    url: `${ENDPOINTS.USERS}/${username}`,
  });

  // Use current user data if it's the current user, otherwise use fetched data

  if (!isCurrentUser && isLoading) {
    return (
      <Container size="lg" className={styles.container}>
        <Center style={{ height: 200 }}>
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  if (!isCurrentUser && !userData) {
    return (
      <Container size="lg" className={styles.container}>
        <Title order={1} className={styles.pageTitle}>
          User Not Found
        </Title>
      </Container>
    );
  }

  return (
    <Container size="lg" className={styles.container}>
      <Title order={1} className={styles.pageTitle}>
        {isCurrentUser ? "My Profile" : `${userData?.firstName}'s Profile`}
      </Title>

      <UserInfo userData={userData || {}} isCurrentUser={isCurrentUser} />

      <UserActivity userId={userData?.userId || ""} />

      <UserPosts
        userId={userData?.userId || ""}
        isCurrentUser={isCurrentUser}
      />
    </Container>
  );
};

export default Profile;

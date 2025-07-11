import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Button, Container, Title, Text, Image } from "@mantine/core";
import styles from "./styles.module.scss";
import { GoogleLogoIcon } from "@phosphor-icons/react";
import ENDPOINTS from "@/common/endpoints";

export const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("auth_token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleGoogleSignIn = () => {
    window.location.href = ENDPOINTS.LOGIN;
  };

  return (
    <div className={styles.loginContainer}>
      <Container size="lg" className={styles.contentContainer}>
        <div className={styles.content}>
          <div className={styles.leftSection}>
            <Title className={styles.title}>Daily Tech</Title>

            <Text className={styles.caption} mb="md">
              Your <span className={styles.gradientText}>daily dose</span> of
              developer
              <span className={styles.gradientText}> inspiration</span> and
              knowledge
            </Text>

            <Text c="dimmed" mb="lg" className={styles.content}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
              posuere, sapien non faucibus vulputate, ex nulla vestibulum dui,
              eu molestie lacus nisl eu justo. Proin non ex eget nulla sagittis
              faucibus consequat et magna. Duis ullamcorper lobortis mi, at
              sodales lorem pretium id. Cras ac pharetra ipsum.
            </Text>

            <Button
              leftSection={<GoogleLogoIcon weight="bold" />}
              size="lg"
              // className={styles.signInButton}
              onClick={handleGoogleSignIn}
            >
              Sign in with Google
            </Button>
          </div>

          <div className={styles.rightSection}>
            <Image
              src="/landing-graphic.svg"
              alt="Daily Dev"
              className={styles.graphic}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;

import type { FC } from "react";
import styles from "./styles.module.scss";
import { Center } from "@mantine/core";

export const NotFound: FC = () => {
  return (
    <Center h="100%">
      <h3 className={styles.title}>Page not found.</h3>
    </Center>
  );
};

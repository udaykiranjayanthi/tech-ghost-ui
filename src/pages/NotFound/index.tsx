import type { FC } from "react";
import styles from "./styles.module.scss";

export const NotFound: FC = () => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Page not found.</h3>
    </div>
  );
};

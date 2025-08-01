import { useState, type FC } from "react";
import { Posts } from "@/components/Posts";
import { Container, FloatingIndicator, Tabs } from "@mantine/core";
import styles from "./styles.module.scss";

interface HomePageProps {}

export const HomePage: FC<HomePageProps> = () => {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [value, setValue] = useState<string | null>("1");
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };

  return (
    <Container size="lg" p="0">
      <Tabs variant="none" value={value} onChange={setValue}>
        <Tabs.List ref={setRootRef} className={styles.list}>
          <Tabs.Tab value="1" ref={setControlRef("1")} className={styles.tab}>
            For you
          </Tabs.Tab>
          <Tabs.Tab value="2" ref={setControlRef("2")} className={styles.tab}>
            Trending
          </Tabs.Tab>
          <Tabs.Tab value="3" ref={setControlRef("3")} className={styles.tab}>
            Community
          </Tabs.Tab>

          <FloatingIndicator
            target={value ? controlsRefs[value] : null}
            parent={rootRef}
            className={styles.indicator}
          />
        </Tabs.List>

        <Tabs.Panel value="1">
          <Posts />
        </Tabs.Panel>
        <Tabs.Panel value="2">
          <Posts />
        </Tabs.Panel>
        <Tabs.Panel value="3">
          <Posts />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

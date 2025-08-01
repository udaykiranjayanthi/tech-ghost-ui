import { type FC, useEffect } from "react";
import { Outlet } from "react-router";
import { HeaderNavbar } from "../../Navigation/HeaderNavbar";
import { SideNavbar } from "../../Navigation/SideNavbar";
import styles from "./styles.module.scss";
import { useApiQuery } from "@/services/hooks";
import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import type { UserData } from "@/types";

import { useGlobalStore } from "@/store";
import { Box, Center, Drawer, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const MainLayout: FC = () => {
  const [opened, { toggle }] = useDisclosure();

  const { data, isLoading } = useApiQuery<UserData>({
    url: ENDPOINTS.CURRENT_USER,
    queryKey: [RQ_KEYS.CURRENT_USER],
  });

  const setUserDetails = useGlobalStore.use.setUserDetails();

  useEffect(() => {
    if (data) {
      setUserDetails(data);
    }
  }, [data, setUserDetails]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <div>
      <head>
        <title>Daily Tech</title>
      </head>
      <HeaderNavbar opened={opened} toggle={toggle} />

      <div className={styles.container}>
        <Drawer
          opened={opened}
          onClose={toggle}
          size="xs"
          title="Menu"
          padding="md"
          hiddenFrom="sm"
        >
          <SideNavbar />
        </Drawer>

        <Box visibleFrom="sm" className={styles.sidebar}>
          <SideNavbar />
        </Box>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

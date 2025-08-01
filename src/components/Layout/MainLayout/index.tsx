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
import { Box, Center, Drawer, Loader, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const MainLayout: FC = () => {
  const [opened, { toggle }] = useDisclosure();

  const { data, isLoading } = useApiQuery<UserData>({
    url: ENDPOINTS.CURRENT_USER,
    queryKey: [RQ_KEYS.CURRENT_USER],
  });

  const setUserDetails = useGlobalStore.use.setUserDetails();
  const userDetails = useGlobalStore.use.userDetails?.();

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
        <Drawer.Root opened={opened} onClose={toggle} hiddenFrom="md" size="xs">
          <Drawer.Overlay />
          <Drawer.Content>
            <Stack h="100%" gap="0">
              <Drawer.Header>
                <Drawer.Title>{`Hi ${userDetails?.firstName}!`}</Drawer.Title>
                <Drawer.CloseButton />
              </Drawer.Header>
              <Drawer.Body p="0" className={styles.drawerBody}>
                <SideNavbar />
              </Drawer.Body>
            </Stack>
          </Drawer.Content>
        </Drawer.Root>

        <Box visibleFrom="md" className={styles.sidebar}>
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

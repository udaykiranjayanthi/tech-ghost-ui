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

const MainLayout: FC = () => {
  const { data } = useApiQuery<UserData>({
    url: ENDPOINTS.CURRENT_USER,
    queryKey: [RQ_KEYS.CURRENT_USER],
  });

  const setUserDetails = useGlobalStore.use.setUserDetails();

  useEffect(() => {
    if (data) {
      setUserDetails(data);
    }
  }, [data, setUserDetails]);

  return (
    <div>
      <head>
        <title>Daily Tech</title>
      </head>
      <HeaderNavbar />

      <div className={styles.container}>
        <SideNavbar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

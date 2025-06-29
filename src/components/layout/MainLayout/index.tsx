import { type FC } from "react";
import { Outlet } from "react-router";
import { HeaderNavbar } from "../../Navigation/HeaderNavbar";
import { SideNavbar } from "../../Navigation/SideNavbar";
import styles from "./styles.module.scss";

const MainLayout: FC = () => {
  return (
    <div>
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

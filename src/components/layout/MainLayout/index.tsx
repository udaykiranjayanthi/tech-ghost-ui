import { type FC } from "react";
import { Outlet } from "react-router";
import { HeaderNavbar } from "../../Navigation/HeaderNavbar";

const MainLayout: FC = () => {
  return (
    <div>
      <HeaderNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

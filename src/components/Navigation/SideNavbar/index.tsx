import { type FC } from "react";
import {
  BellRingingIcon,
  ChatsCircleIcon,
  GearSixIcon,
  BookmarksIcon,
  UserCircleIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react";
import styles from "./styles.module.scss";
import { NavLink, useLocation } from "react-router";

const linksData = [
  { link: "", label: "Feed", icon: SquaresFourIcon },
  { link: "messages", label: "Messages", icon: ChatsCircleIcon },
  { link: "notifications", label: "Notifications", icon: BellRingingIcon },
  { link: "saved", label: "Saved", icon: BookmarksIcon },
  { link: "account", label: "Account", icon: UserCircleIcon },
];

const bottomLinksData = [
  { link: "settings", label: "Settings", icon: GearSixIcon },
];

export const SideNavbar: FC = () => {
  const pathname = useLocation().pathname;
  const activeLink = pathname.split("/")[1];

  const links = linksData.map((item) => (
    <NavLink
      className={styles.link}
      data-active={item.link === activeLink || undefined}
      to={item.link}
      key={item.label}
    >
      <item.icon className={styles.linkIcon} />
      <span>{item.label}</span>
    </NavLink>
  ));

  const bottomLinks = bottomLinksData.map((item) => (
    <NavLink
      className={styles.link}
      data-active={item.link === activeLink || undefined}
      to={item.link}
      key={item.label}
    >
      <item.icon className={styles.linkIcon} />
      <span>{item.label}</span>
    </NavLink>
  ));

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarMain}>{links}</div>
      <div className={styles.footer}>{bottomLinks}</div>
    </nav>
  );
};

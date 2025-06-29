import { useState, type FC } from "react";
import {
  BellRingingIcon,
  ChatsCircleIcon,
  SignOutIcon,
  GearSixIcon,
  BookmarkIcon,
  UserCircleIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react";
import styles from "./styles.module.scss";
import { NavLink } from "react-router";

const linksData = [
  { link: "", label: "Feed", icon: SquaresFourIcon },
  { link: "messages", label: "Messages", icon: ChatsCircleIcon },
  { link: "notifications", label: "Notifications", icon: BellRingingIcon },
  { link: "saved", label: "Saved", icon: BookmarkIcon },
  { link: "account", label: "Account", icon: UserCircleIcon },
];

const bottomLinksData = [
  { link: "settings", label: "Settings", icon: GearSixIcon },
  { link: "logout", label: "Logout", icon: SignOutIcon },
];

export const SideNavbar: FC = () => {
  const [active, setActive] = useState("Feed");

  const links = linksData.map((item) => (
    <NavLink
      className={styles.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={() => {
        setActive(item.label);
      }}
    >
      <item.icon className={styles.linkIcon} />
      <span>{item.label}</span>
    </NavLink>
  ));

  const bottomLinks = bottomLinksData.map((item) => (
    <NavLink
      className={styles.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={() => {
        setActive(item.label);
      }}
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

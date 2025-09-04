import { UserCircleIcon, SignOutIcon } from "@phosphor-icons/react";
import {
  Avatar,
  Burger,
  Button,
  Group,
  Text,
  Menu,
  UnstyledButton,
  Title,
  Flex,
} from "@mantine/core";
import styles from "./styles.module.scss";
import type { FC } from "react";
import { NavLink, useNavigate } from "react-router";
import { useGlobalStore } from "@/store";
import Search from "../Search";

const links = [
  { link: "/about", label: "Features" },
  { link: "/pricing", label: "Pricing" },
];

interface HeaderNavbarProps {
  opened: boolean;
  toggle: () => void;
}

export const HeaderNavbar: FC<HeaderNavbarProps> = ({ opened, toggle }) => {
  const userDetails = useGlobalStore.use.userDetails?.();

  const navigate = useNavigate();

  const items = links.map((link) => (
    <NavLink key={link.label} to={link.link} className={styles.link}>
      {link.label}
    </NavLink>
  ));

  const logout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <Flex h="56px" justify="space-between" align="center" gap="md">
        <Group className={styles.logoGroup}>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="md" />
          <NavLink to="/">
            <Title order={3} className={styles.logo}>
              Tech Ghost
            </Title>
          </NavLink>
        </Group>

        <div className={styles.search}>
          <Search />
        </div>

        <Flex align="center" gap="md">
          <Group gap={5} visibleFrom="md">
            {items}
          </Group>
          <Group gap={10}>
            <Button variant="outline" onClick={() => navigate("/create-post")}>
              Create
            </Button>
            <Menu
              position="bottom-end"
              withArrow
              width={200}
              shadow="md"
              transitionProps={{ transition: "pop" }}
            >
              <Menu.Target>
                <UnstyledButton className={styles.userButton}>
                  <Group gap={5}>
                    <Text size="sm" visibleFrom="md">
                      Hi {userDetails?.firstName}!
                    </Text>
                    <Avatar
                      src={userDetails?.pictureUrl}
                      name={
                        userDetails?.firstName + " " + userDetails?.lastName
                      }
                      color="initials"
                    />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<UserCircleIcon size={16} />}
                  component={NavLink}
                  to={`/profile/${userDetails?.username}`}
                >
                  Profile
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<SignOutIcon size={16} />}
                  onClick={logout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Flex>
      </Flex>
    </header>
  );
};

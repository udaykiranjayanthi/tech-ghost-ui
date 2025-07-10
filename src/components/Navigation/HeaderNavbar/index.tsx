import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import {
  Autocomplete,
  Avatar,
  Burger,
  Button,
  Group,
  Text,
  Menu,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import styles from "./styles.module.scss";
import type { FC } from "react";
import { NavLink } from "react-router";
import ENDPOINTS from "@/common/endpoints";
import { useGlobalStore } from "@/store";

const links = [
  { link: "/about", label: "Features" },
  { link: "/pricing", label: "Pricing" },
];

export const HeaderNavbar: FC = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const userDetails = useGlobalStore.use.userDetails?.();

  const items = links.map((link) => (
    <NavLink key={link.label} to={link.link} className={styles.link}>
      {link.label}
    </NavLink>
  ));

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          <h2 className={styles.logo}>Daily Tech</h2>
        </Group>

        <Group>
          <Autocomplete
            className={styles.search}
            placeholder="Search"
            leftSection={<MagnifyingGlassIcon size={16} />}
            data={[
              "React",
              "Angular",
              "Vue",
              "Next.js",
              "Riot.js",
              "Svelte",
              "Blitz.js",
            ]}
            visibleFrom="xs"
          />
          <Group ml={20} gap={5} className={styles.links} visibleFrom="sm">
            {items}
          </Group>
          <Group ml={20} gap={10} className={styles.links} visibleFrom="sm">
            <NavLink to="/create-post">
              <Button variant="outline">Create</Button>
            </NavLink>
            {userDetails ? (
              <Menu
                position="bottom-end"
                withArrow
                width={200}
                shadow="md"
                transitionProps={{ transition: "pop" }}
              >
                <Menu.Target>
                  <UnstyledButton className={styles.userButton}>
                    <Group
                      ml={10}
                      gap={5}
                      className={styles.links}
                      visibleFrom="sm"
                    >
                      <Text size="sm">Hi {userDetails.firstName}!</Text>
                      <Avatar src={userDetails.pictureUrl} radius="xl" />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<UserCircleIcon size={16} />}
                    component={NavLink}
                    to={`/profile/${userDetails.username}`}
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={<SignOutIcon size={16} />}
                    color="red"
                    onClick={() => {
                      // Handle logout
                      console.log("Logout clicked");
                    }}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Button onClick={() => (window.location.href = ENDPOINTS.LOGIN)}>
                Login
              </Button>
            )}
          </Group>
        </Group>
      </div>
    </header>
  );
};

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Autocomplete, Burger, Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import styles from "./styles.module.scss";
import type { FC } from "react";
import { NavLink } from "react-router";
import ENDPOINTS from "@/common/endpoints";

const links = [
  { link: "/about", label: "Features" },
  { link: "/pricing", label: "Pricing" },
];

export const HeaderNavbar: FC = () => {
  const [opened, { toggle }] = useDisclosure(false);

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

            <Button onClick={() => (window.location.href = ENDPOINTS.LOGIN)}>
              Login
            </Button>
          </Group>
        </Group>
      </div>
    </header>
  );
};

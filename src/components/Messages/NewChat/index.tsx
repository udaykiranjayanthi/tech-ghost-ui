import { useState } from "react";
import {
  Modal,
  TextInput,
  Avatar,
  Text,
  Group,
  Stack,
  ScrollArea,
  Loader,
  Center,
  Card,
} from "@mantine/core";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useApiInfiniteQuery } from "@/services/hooks";
import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import type { UserData } from "@/types";
import { useDebouncedValue } from "@mantine/hooks";
import { NavLink } from "react-router";
import styles from "./styles.module.scss";

interface NewChatProps {
  opened: boolean;
  onClose: () => void;
}

const NewChat = ({ opened, onClose }: NewChatProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300);

  // Fetch users data
  const limit = 2;
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useApiInfiniteQuery<UserData>({
      url: ENDPOINTS.SEARCH_USERS,
      queryKey: [RQ_KEYS.SEARCH_USERS, debouncedQuery],
      initialPageParam: null,
      params: {
        limit,
        search: debouncedQuery,
      },
      options: {
        enabled: opened,
      },
    });

  const users = data?.pages?.flatMap((page) => page.data) ?? [];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="New Chat"
      size="md"
      centered
    >
      <TextInput
        placeholder="Search"
        leftSection={<MagnifyingGlassIcon size={16} />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
        mb="md"
      />

      <ScrollArea
        h={400}
        scrollbarSize={6}
        onScrollPositionChange={({ y }) => {
          // TODO
          if (y > 300 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
      >
        {users.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No results
          </Text>
        ) : (
          <Stack gap="xs">
            {users.map((user) => (
              <NavLink
                to={`/messages/${user.userId}`}
                key={user.userId}
                onClick={() => onClose()}
              >
                <Card className={styles.connectionCard} p="xs">
                  <Group wrap="nowrap">
                    <Avatar
                      src={user.pictureUrl}
                      radius="xl"
                      size="md"
                      name={user.firstName + " " + user.lastName}
                      color="initials"
                    />
                    <div style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>
                        {user.firstName} {user.lastName}
                      </Text>
                      <Text size="xs" c="dimmed">
                        @{user.username}
                      </Text>
                    </div>
                  </Group>
                </Card>
              </NavLink>
            ))}
            {isFetchingNextPage && (
              <Center py="sm">
                <Loader size="sm" />
              </Center>
            )}
          </Stack>
        )}
      </ScrollArea>
    </Modal>
  );
};

export default NewChat;

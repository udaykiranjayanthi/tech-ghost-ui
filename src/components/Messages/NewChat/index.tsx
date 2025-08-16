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

  // Fetch connections data
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

  const connections = data?.pages?.flatMap((page) => page.data) ?? [];

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
        {connections.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No results
          </Text>
        ) : (
          <Stack gap="xs">
            {connections.map((connection) => (
              <NavLink
                to={`/messages/${connection.userId}`}
                key={connection.userId}
                onClick={() => onClose()}
              >
                <Card className={styles.connectionCard} p="xs">
                  <Group wrap="nowrap">
                    <Avatar src={connection.pictureUrl} radius="xl" size="md" />
                    <div style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>
                        {connection.firstName} {connection.lastName}
                      </Text>
                      <Text size="xs" c="dimmed">
                        @{connection.username}
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

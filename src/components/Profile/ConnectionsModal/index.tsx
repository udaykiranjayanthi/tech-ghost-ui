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
  Button,
  Flex,
} from "@mantine/core";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useApiInfiniteQuery } from "@/services/hooks";
import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import type { UserData } from "@/types";
import { useDebouncedValue } from "@mantine/hooks";
import { NavLink } from "react-router";
import styles from "./styles.module.scss";

export type ConnectionType = "followers" | "following" | null;

interface ConnectionsModalProps {
  opened: boolean;
  onClose: () => void;
  userId: string;
  type: ConnectionType;
}

interface ConnectionData extends UserData {}

const ConnectionsModal = ({
  opened,
  onClose,
  userId,
  type,
}: ConnectionsModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300);

  // Get the appropriate title and placeholder based on connection type
  const modalTitle = type === "followers" ? "Followers" : "Following";
  const searchPlaceholder =
    type === "followers" ? "Search followers..." : "Search following...";

  // Determine the query key and endpoint based on connection type
  const queryKey =
    type === "followers" ? RQ_KEYS.USER_FOLLOWERS : RQ_KEYS.USER_FOLLOWING;
  const endpoint = `${ENDPOINTS.USERS}/${userId}/${type}`;

  // Fetch connections data
  const limit = 2;
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useApiInfiniteQuery<ConnectionData>({
      url: endpoint,
      queryKey: [queryKey, userId],
      initialPageParam: null,
      params: {
        limit,
        search: debouncedQuery,
      },
      options: {
        enabled: opened && type !== null,
      },
    });

  const connections = data?.pages?.flatMap((page) => page.data) ?? [];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={modalTitle}
      size="md"
      centered
    >
      <TextInput
        placeholder={searchPlaceholder}
        leftSection={<MagnifyingGlassIcon size={16} />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
        mb="md"
      />

      <ScrollArea h={400} scrollbarSize={6}>
        {connections.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No results
          </Text>
        ) : (
          <Stack gap="xs">
            {connections.map((connection) => (
              <NavLink
                to={`/profile/${connection.username}`}
                key={connection.userId}
                onClick={() => onClose()}
              >
                <Card className={styles.connectionCard} p="xs">
                  <Group wrap="nowrap">
                    <Avatar
                      src={connection.pictureUrl}
                      radius="xl"
                      size="md"
                      name={connection.firstName + " " + connection.lastName}
                      color="initials"
                    />
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
              <Center h={200}>
                <Loader />
              </Center>
            )}
            {hasNextPage && (
              <Flex justify="center">
                <Button
                  variant="outline"
                  mt="md"
                  onClick={() => fetchNextPage()}
                >
                  Load more
                </Button>
              </Flex>
            )}
          </Stack>
        )}
      </ScrollArea>
    </Modal>
  );
};

export default ConnectionsModal;

import { useState, useEffect } from "react";
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
import { useApiQuery } from "@/services/hooks";
import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import type { Pagination, UserData } from "@/types";
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
  const [filteredConnections, setFilteredConnections] = useState<
    ConnectionData[]
  >([]);

  // Get the appropriate title and placeholder based on connection type
  const modalTitle = type === "followers" ? "Followers" : "Following";
  const searchPlaceholder =
    type === "followers" ? "Search followers..." : "Search following...";
  const emptyStateMessage =
    type === "followers" ? "No followers yet" : "Not following anyone yet";
  const noMatchesMessage = "No results for your search";

  // Determine the query key and endpoint based on connection type
  const queryKey =
    type === "followers" ? RQ_KEYS.USER_FOLLOWERS : RQ_KEYS.USER_FOLLOWING;
  const endpoint = `${ENDPOINTS.USERS}/${userId}/${type}`;

  // Fetch connections data
  const { data, isLoading } = useApiQuery<Pagination<ConnectionData>>({
    queryKey: [queryKey, userId],
    url: endpoint,
    options: {
      enabled: opened && type !== null,
    },
  });

  const { data: connections } = data || {};

  // Filter connections based on search query
  useEffect(() => {
    if (!connections) {
      setFilteredConnections([]);
      return;
    }

    if (!debouncedQuery) {
      setFilteredConnections(connections);
      return;
    }

    const query = debouncedQuery.toLowerCase();
    const filtered = connections.filter(
      (connection) =>
        connection.firstName.toLowerCase().includes(query) ||
        connection.lastName.toLowerCase().includes(query) ||
        connection.username.toLowerCase().includes(query)
    );

    setFilteredConnections(filtered);
  }, [connections, debouncedQuery]);

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
        {isLoading ? (
          <Center h={200}>
            <Loader />
          </Center>
        ) : filteredConnections.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            {connections?.length === 0 ? emptyStateMessage : noMatchesMessage}
          </Text>
        ) : (
          <Stack gap="xs">
            {filteredConnections.map((connection) => (
              <NavLink
                to={`/profile/${connection.username}`}
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
          </Stack>
        )}
      </ScrollArea>
    </Modal>
  );
};

export default ConnectionsModal;

import {
  Box,
  Combobox,
  Loader,
  Text,
  TextInput,
  useCombobox,
} from "@mantine/core";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useApiInfiniteQuery } from "@/services/hooks";
import ENDPOINTS from "@/common/endpoints";
import { RQ_KEYS } from "@/common/rqkeys";
import { useDebouncedValue } from "@mantine/hooks";
import { useMemo, useState } from "react";
import { type PostData } from "@/types";
import { useNavigate } from "react-router";
import styles from "./styles.module.scss";

const Search = () => {
  const combobox = useCombobox();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);
  const navigate = useNavigate();

  const limit = 2;

  const { data, isLoading } = useApiInfiniteQuery<PostData>({
    url: ENDPOINTS.POSTS,
    queryKey: [RQ_KEYS.POSTS, debouncedSearchQuery],
    params: {
      search: debouncedSearchQuery,
      limit,
    },
  });

  const posts = useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data]
  );

  const options = useMemo(() => {
    return posts.map((post) => (
      <Combobox.Option
        value={post.postId}
        key={post.postId}
        onClick={() => navigate(`/post/${post.postId}`)}
      >
        <Box p="xs">
          <Text className={styles.optionsTitle}>{post.title}</Text>

          <Text size="xs" c="dimmed">
            {post.author.firstName} {post.author.lastName}
          </Text>
        </Box>
      </Combobox.Option>
    ));
  }, [posts]);

  return (
    <Combobox
      onOptionSubmit={() => {
        setSearchQuery("");
        combobox.closeDropdown();
      }}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          placeholder="Search posts"
          value={searchQuery}
          leftSection={<MagnifyingGlassIcon size={16} />}
          rightSection={isLoading ? <Loader size="xs" /> : null}
          onChange={(event) => {
            setSearchQuery(event.currentTarget.value);
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length === 0 ? (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          ) : (
            options
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default Search;
